import * as Boom from '@hapi/boom';
import * as Joi from '@hapi/joi';

import {makeRequest, getPgClient, makeTransactionRequest} from 'server/db/client';
import {seizePaginationParams, makeInsert} from 'server/lib/db';
import {TelegramBot} from 'server/lib/telegram-bot';

export type OrderStatus = 'new' | 'reject' | 'bought' | 'called';

const orderSchema = Joi.object().keys({
    customer_name: Joi.string().required(),
    customer_phone: Joi.string().required(),
    status: Joi.string(),
    order_date: Joi.string(),
    sold_date: Joi.string().allow(null, '')
});

const customerOrderSchema = Joi.object().keys({
    airpodIds: Joi.array().items(Joi.string()).required(),
    iphoneIds: Joi.array().items(Joi.string()).required(),
    customer: Joi.object().keys({
        name: Joi.string().required(),
        phone: Joi.string().required()
    })
});

const ORDER_TABLE_NAME = '"order"';
const ORDER_ITEM_TABLE_NAME = 'order_item';

interface IAddOrderCustomerData {
    customer: {
        name: string;
        phone: string;
    };
    airpodIds: string[];
    iphoneIds: string[];
}

export class Order {
    static async getEnums() {
        const data = await Promise.all(['ORDER_STATUS_T'].map(async (key) => {
            return makeRequest({
                text: `SELECT unnest(enum_range(NULL::${key}))::text;`,
                values: []
            });
        }));

        return {
            statuses: data[0]!.rows.map((x) => x.unnest)
        };
    }

    static async getOpenedOrders(query: Record<string, any>) {
        const pagination = seizePaginationParams(query);

        const data = await makeRequest({
            text: `
                SELECT * FROM ${ORDER_TABLE_NAME}
                WHERE status='new' OR status='called'
                ORDER BY order_date DESC
                LIMIT ${pagination.limit} OFFSET ${pagination.offset};
            `,
            values: []
        });

        return data.rows;
    }

    static async insertOrder(body: Record<string, any>) {
        const result = Joi.validate(body, orderSchema);
        if (result.error) {
            throw Boom.badRequest(result.error.details.map(({message}) => message).join(', '));
        }

        const {names, values} = makeInsert(result.value);
        const data = await makeRequest({
            text: `
                INSERT INTO ${ORDER_TABLE_NAME}
                (${names.join(', ')})
                VALUES (${names.map((_, i) => `$${i + 1}`).join(', ')})
                RETURNING *;
            `,
            values: [...values]
        });

        return data.rows;
    }

    static async updateOrder(orderId: string, body: Record<string, any>) {
        const result = Joi.validate(body, orderSchema);
        if (result.error) {
            throw Boom.badRequest(result.error.details.map(({message}) => message).join(', '));
        }

        const {names, values} = makeInsert(result.value);
        const data = await makeRequest({
            text: `
                UPDATE ${ORDER_TABLE_NAME}
                SET (${names.join(', ')})=(${names.map((_, i) => `$${i + 2}`).join(', ')})
                WHERE id=$1 RETURNING *;
            `,
            values: [orderId, ...values]
        });

        return data.rows;
    }

    static async getOrder(id: string) {
        const data = await makeRequest({
            text: `SELECT * FROM ${ORDER_TABLE_NAME} WHERE id=$1;`,
            values: [id]
        });

        if (data.rows.length === 0) {
            throw Boom.notFound();
        }

        return data.rows;
    }

    static async changeOrderStatus(orderId: string, status: OrderStatus) {
        const data = await makeRequest({
            text: `
                UPDATE ${ORDER_TABLE_NAME}
                SET status=$2
                WHERE id=$1 RETURNING *;
            `,
            values: [orderId, status]
        });

        TelegramBot.sendMessageToChat(TelegramBot.messageUpdateOrderStatus(
            orderId,
            status
        ));
        return data.rows;
    }

    static async getOrderItems(orderId: string) {
        const [airpods, iphones] = await Promise.all([
            makeRequest({
                text: `
                    SELECT airpod.* FROM ${ORDER_ITEM_TABLE_NAME}
                    INNER JOIN airpod ON order_item.airpod_id = airpod.id
                    WHERE order_id=$1 AND airpod_id IS NOT NULL;
                `,
                values: [orderId]
            }),
            makeRequest({
                text: `
                    SELECT iphone.* FROM ${ORDER_ITEM_TABLE_NAME}
                    INNER JOIN iphone ON order_item.iphone_id = iphone.id
                    WHERE order_id=$1 AND iphone_id IS NOT NULL;
                `,
                values: [orderId]
            })
        ]);

        return {
            airpods: airpods.rows,
            iphones: iphones.rows
        };
    }

    static async addAirpodOrder(orderId: string, airpodId: string) {
        const data = await makeRequest({
            text: `
                INSERT INTO ${ORDER_ITEM_TABLE_NAME}
                (order_id, airpod_id) VALUES ($1, $2)
                RETURNING *;
            `,
            values: [orderId, airpodId]
        });

        return data.rows;
    }

    static async deleteAirpodOrder(orderId: string, airpodId: string) {
        const data = await makeRequest({
            text: `
                DELETE FROM ${ORDER_ITEM_TABLE_NAME}
                WHERE order_id=$1 AND airpod_id=$2
                RETURNING *;
            `,
            values: [orderId, airpodId]
        });

        return data.rows;
    }

    static async addIphoneOrder(orderId: string, iphoneId: string) {
        const data = await makeRequest({
            text: `
                INSERT INTO ${ORDER_ITEM_TABLE_NAME}
                (order_id, iphone_id) VALUES ($1, $2)
                RETURNING *;
            `,
            values: [orderId, iphoneId]
        });

        return data.rows;
    }

    static async deleteIphoneOrder(orderId: string, iphoneId: string) {
        const data = await makeRequest({
            text: `
                DELETE FROM ${ORDER_ITEM_TABLE_NAME}
                WHERE order_id=$1 AND iphone_id=$2
                RETURNING *;
            `,
            values: [orderId, iphoneId]
        });

        return data.rows;
    }

    static async addCustomerOrder(body: IAddOrderCustomerData) {
        const result = Joi.validate(body, customerOrderSchema);
        if (result.error) {
            throw Boom.badRequest(result.error.details.map(({message}) => message).join(', '));
        }

        const client = await getPgClient();
        const {airpodIds, iphoneIds, customer: {name, phone}} = result.value;

        try {
            await makeTransactionRequest(client, {text: 'BEGIN'});

            const {rows: [order]} = await makeTransactionRequest(client, {
                text: `INSERT INTO "order" (customer_name, customer_phone) VALUES ($1, $2) RETURNING id;`,
                values: [name, phone]
            });

            if (airpodIds.length > 0) {
                const queryResults = await Promise.all(airpodIds.map((id) => {
                    return makeTransactionRequest(client, {
                        text: `
                            INSERT INTO airpod (series, original, charging_case, price, discount)
                                SELECT series, original, charging_case, price, discount
                                FROM airpod_bar
                                WHERE id=$1
                            RETURNING id;
                        `,
                        values: [id]
                    });
                }));

                await Promise.all(queryResults.map(({rows: [row]}) => {
                    return makeTransactionRequest(client, {
                        text: `INSERT INTO order_item (order_id, airpod_id) VALUES ($1, $2);`,
                        values: [order.id, row.id]
                    });
                }));
            }

            if (iphoneIds.length > 0) {
                const queryResults = await Promise.all(iphoneIds.map((id) => {
                    return makeTransactionRequest(client, {
                        text: `
                            INSERT INTO iphone (model, color, memory_capacity, price, discount)
                                SELECT model, color, memory_capacity, price, discount
                                FROM iphone_bar
                                WHERE id=$1
                            RETURNING id;
                        `,
                        values: [id]
                    });
                }));

                await Promise.all(queryResults.map(({rows: [row]}) => {
                    return makeTransactionRequest(client, {
                        text: `INSERT INTO order_item (order_id, iphone_id) VALUES ($1, $2);`,
                        values: [order.id, row.id]
                    });
                }));
            }

            await makeTransactionRequest(client, {text: 'COMMIT'});

            const {rows: [sum]} = await makeRequest({
                text: `
                    SELECT
                           SUM((airpod.price / 100) * (100 - airpod.discount)) as airpodSum,
                           SUM((iphone.price / 100) * (100 - iphone.discount)) as iphoneSum
                    FROM order_item
                        LEFT JOIN airpod ON order_item.airpod_id = airpod.id
                        LEFT JOIN iphone ON order_item.iphone_id = iphone.id
                    WHERE order_item.order_id=$1;
                `,
                values: [order.id]
            });

            TelegramBot.sendMessageToChat(TelegramBot.messageNewOrder(
                order.id,
                String(Number(sum.airpodsum) + Number(sum.iphonesum))
            ));
        } catch (err) {
            await makeTransactionRequest(client, {text: 'ROLLBACK'});
            TelegramBot.sendMessageToChat(TelegramBot.messageNewOrderError(
                JSON.stringify({
                    error: err.message,
                    body
                })
            ));
            throw err;
        } finally {
            client.release();
        }

        return [];
    }
}
