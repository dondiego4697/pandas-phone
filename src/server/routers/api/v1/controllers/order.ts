import * as Boom from '@hapi/boom';
import * as Joi from '@hapi/joi';

import {makeRequest} from 'server/db/client';
import {seizePaginationParams, makeInsert} from 'server/lib/db';

const updateOrderSchema = Joi.object().keys({
    customer_name: Joi.string().required(),
    customer_phone: Joi.string().required(),
    status: Joi.string().required(),
    order_date: Joi.string().required(),
    sold_date: Joi.string().allow(null).default('')
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

        if (data.some((x) => !x)) {
            throw Boom.badData();
        }

        return {
            statuses: data[0]!.rows.map((x) => x.unnest),
            good_types: data[1]!.rows.map((x) => x.unnest)
        };
    }

    static async updateOrder(orderId: string, body: Record<string, any>) {
        const result = Joi.validate(body, updateOrderSchema);
        if (result.error) {
            throw Boom.badRequest(result.error.details.map(({message}) => message).join(', '));
        }

        // TODO if status === 'reject' || bought -> sold_date:now()
        const {names, values} = makeInsert(result.value);
        const data = await makeRequest({
            text: `
                UPDATE ${ORDER_TABLE_NAME}
                SET (${names.join(', ')})=(${names.map((_, i) => `$${i + 2}`).join(', ')})
                WHERE id=$1 RETURNING *;
            `,
            values: [orderId, ...values]
        });

        if (!data) {
            throw Boom.badData();
        }

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

        if (!data) {
            throw Boom.badData();
        }

        return data.rows;
    }

    static async getOrderItems(orderId: string) {
        const data = await makeRequest({
            text: `SELECT * FROM ${ORDER_ITEM_TABLE_NAME} WHERE order_id=$1;`,
            values: [orderId]
        });

        if (!data) {
            throw Boom.badData();
        }

        return data.rows;
    }
}
