import * as Boom from '@hapi/boom';
import * as Joi from '@hapi/joi';

import {makeRequest} from 'server/db/client';
import {seizePaginationParams, makeInsert} from 'server/lib/db';

const orderSchema = Joi.object().keys({
    customer_name: Joi.string().required(),
    customer_phone: Joi.string().required(),
    status: Joi.string().required(),
    order_date: Joi.string().required(),
    sold_date: Joi.string().allow(null, '').default('')
});

const ORDER_TABLE_NAME = '"order"';
const ORDER_ITEM_TABLE_NAME = 'order_item';

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
                LIMIT ${pagination.limit} OFFSET ${pagination.offset};
            `,
            values: []
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

        return data.rows;
    }

    static async changeOrderStatus(orderId: string, status: string) {
        const data = await makeRequest({
            text: `
                UPDATE ${ORDER_TABLE_NAME}
                SET status=$2
                WHERE id=$1 RETURNING *;
            `,
            values: [orderId, status]
        });

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
}
