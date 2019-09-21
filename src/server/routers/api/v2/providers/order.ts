import * as Boom from '@hapi/boom';
import {PoolClient} from 'pg';

import {makeRequest} from 'server/db/client';
import {seizePaginationParams, makeInsert} from 'server/lib/db';
import {makeTransactionRequest} from 'server/db/client';
import {TelegramBot as TB} from 'server/lib/telegram-bot';
import {OrderStatus} from 'server/routers/api/v2/validators/order';

const TABLE_NAMES = {
    order: '"order"',
    orderItem: 'order_item'
};

export class OrderProvider {
    static async getOrderEnums() {
        const data = await Promise.all([
            'ORDER_STATUS_T'
        ].map(async (key) => makeRequest({
            text: `SELECT unnest(enum_range(NULL::${key}))::text;`,
            values: []
        })));

        return {
            statuses: data[0]!.rows.map((row) => row.unnest)
        };
    }

    static async getOpenedOrders(query: Record<string, any>) {
        const pagination = seizePaginationParams(query);

        const {rows} = await makeRequest({
            text: `
                SELECT * FROM ${TABLE_NAMES.order}
                WHERE status='new' OR status='called'
                ORDER BY order_date DESC
                LIMIT ${pagination.limit} OFFSET ${pagination.offset};
            `,
            values: []
        });

        return rows;
    }

    static async getOrderItems(id: string) {
        const [airpods, iphones] = await Promise.all([
            makeRequest({
                text: `
                    SELECT airpod_order.* FROM ${TABLE_NAMES.orderItem}
                    INNER JOIN airpod_order ON order_item.airpod_id = airpod_order.id
                    WHERE order_id=$1 AND airpod_id IS NOT NULL;
                `,
                values: [id]
            }),
            makeRequest({
                text: `
                    SELECT iphone_order.* FROM ${TABLE_NAMES.orderItem}
                    INNER JOIN iphone_order ON order_item.iphone_id = iphone_order.id
                    WHERE order_id=$1 AND iphone_id IS NOT NULL;
                `,
                values: [id]
            })
        ]);

        return {
            airpods: airpods.rows,
            iphones: iphones.rows
        };
    }

    static async getOrder(id: string) {
        const {rows} = await makeRequest({
            text: `SELECT * FROM ${TABLE_NAMES.order} WHERE id=$1;`,
            values: [id]
        });

        if (rows.length === 0) {
            throw Boom.notFound();
        }

        return rows;
    }

    static async createOrder(client: PoolClient, body: Record<string, any>) {
        const {names, values} = makeInsert(body);
        const {rows} = await makeTransactionRequest(client, {
            text: `
                INSERT INTO ${TABLE_NAMES.order}
                (${names.join(', ')}) VALUES (${names.map((_, i) => `$${i + 1}`).join(', ')})
                RETURNING *;
            `,
            values: [...values]
        });

        return rows;
    }

    static async updateOrder(client: PoolClient, id: string, body: Record<string, any>) {
        const {names, values} = makeInsert(body);
        const {rows} = await makeTransactionRequest(client, {
            text: `
                UPDATE ${TABLE_NAMES.order}
                SET (${names.join(', ')})=(${names.map((_, i) => `$${i + 2}`).join(', ')})
                WHERE id=$1 RETURNING *;
            `,
            values: [id, ...values]
        });

        return rows;
    }

    static async updateOrderStatus(client: PoolClient, id: string, status: OrderStatus) {
        const {rows} = await makeTransactionRequest(client, {
            text: `
                UPDATE ${TABLE_NAMES.order}
                SET status=$2
                WHERE id=$1 RETURNING *;
            `,
            values: [id, status]
        });

        TB.sendMessageToChat(TB.messageUpdateOrderStatus(id, status));

        return rows;
    }

    static async addAirpodOrder(client: PoolClient, orderId: string, airpodId: string) {
        const {rows} = await makeTransactionRequest(client, {
            text: `
                INSERT INTO ${TABLE_NAMES.orderItem}
                (order_id, airpod_id) VALUES ($1, $2)
                RETURNING *;
            `,
            values: [orderId, airpodId]
        });

        return rows;
    }

    static async deleteAirpodOrder(client: PoolClient, orderId: string, airpodId: string) {
        const {rows} = await makeTransactionRequest(client, {
            text: `
                DELETE FROM ${TABLE_NAMES.orderItem}
                WHERE order_id=$1 AND airpod_id=$2
                RETURNING *;
            `,
            values: [orderId, airpodId]
        });

        return rows;
    }

    static async addIphoneOrder(client: PoolClient, orderId: string, iphoneId: string) {
        const {rows} = await makeTransactionRequest(client, {
            text: `
                INSERT INTO ${TABLE_NAMES.orderItem}
                (order_id, iphone_id) VALUES ($1, $2)
                RETURNING *;
            `,
            values: [orderId, iphoneId]
        });

        return rows;
    }

    static async deleteIphoneOrder(client: PoolClient, orderId: string, iphoneId: string) {
        const {rows} = await makeTransactionRequest(client, {
            text: `
                DELETE FROM ${TABLE_NAMES.orderItem}
                WHERE order_id=$1 AND iphone_id=$2
                RETURNING *;
            `,
            values: [orderId, iphoneId]
        });

        return rows;
    }
}
