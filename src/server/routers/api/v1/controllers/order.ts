import * as Boom from '@hapi/boom';
import * as Joi from '@hapi/joi';

import {makeRequest} from 'server/db/client';
import {seizePaginationParams, makeInsert} from 'server/lib/db';

const orderSchema = Joi.object().keys({
    customer_name: Joi.string().required(),
    customer_phone: Joi.string().required(),
    status: Joi.string().required(),
    order_date: Joi.string().required(),
    sold_date: Joi.string().allow(null).default('')
});

const orderItemSchema = Joi.object().keys({
    order_id: Joi.string().required(),
    serial_number: Joi.string().allow(null, '').default(''),
    imei: Joi.string().allow(null, '').default(''),
    price: Joi.number().positive().required(),
    discount: Joi.number().min(0).max(100).default(0),
    good_type: Joi.string().required(),
    good_id: Joi.string().required()
});

const ORDER_TABLE_NAME = '"order"';
const ORDER_ITEM_TABLE_NAME = 'order_item';

export class Order {
    static async getEnums() {
        const data = await Promise.all(['ORDER_STATUS_T', 'ORDER_GOOD_TYPE_T'].map(async (key) => {
            return makeRequest({
                text: `SELECT unnest(enum_range(NULL::${key}))::text;`,
                values: []
            });
        }));

        return {
            statuses: data[0]!.rows.map((x) => x.unnest),
            good_types: data[1]!.rows.map((x) => x.unnest)
        };
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

    static async getOrder(id: string) {
        const data = await makeRequest({
            text: `SELECT * FROM ${ORDER_TABLE_NAME} WHERE id=$1;`,
            values: [id]
        });

        return data.rows;
    }

    static async getOrderItems(orderId: string) {
        const data = await makeRequest({
            text: `SELECT * FROM ${ORDER_ITEM_TABLE_NAME} WHERE order_id=$1;`,
            values: [orderId]
        });

        return data.rows;
    }

    static async deleteOrderItem(id: string) {
        const data = await makeRequest({
            text: `DELETE FROM ${ORDER_ITEM_TABLE_NAME} WHERE id=$1 RETURNING *;`,
            values: [id]
        });

        return data.rows;
    }

    static async insertOrderItem(body: Record<string, any>) {
        const result = Joi.validate(body, orderItemSchema);
        if (result.error) {
            throw Boom.badRequest(result.error.details.map(({message}) => message).join(', '));
        }

        const {names, values} = makeInsert(result.value);
        const data = await makeRequest({
            text: `
                INSERT INTO ${ORDER_ITEM_TABLE_NAME}
                (${names.join(', ')})
                VALUES (${names.map((_, i) => `$${i + 1}`).join(', ')})
                RETURNING *;
            `,
            values: [...values]
        });

        return data.rows;
    }

    static async updateOrderItem(id: string, body: Record<string, any>) {
        const result = Joi.validate(body, orderItemSchema);
        if (result.error) {
            throw Boom.badRequest(result.error.details.map(({message}) => message).join(', '));
        }

        const {names, values} = makeInsert(result.value);
        const data = await makeRequest({
            text: `
                UPDATE ${ORDER_ITEM_TABLE_NAME}
                SET (${names.join(', ')})=(${names.map((_, i) => `$${i + 2}`).join(', ')})
                WHERE id=$1 RETURNING *;
            `,
            values: [id, ...values]
        });

        return data.rows;
    }
}
