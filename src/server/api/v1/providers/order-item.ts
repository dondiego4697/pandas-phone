import {PoolClient} from 'pg';

import {makeRequest} from 'server/db/client';
import {
    seizePaginationParams,
    makeInsertParams,
    makeInsertText,
    makeUpdateText,
    makeDeleteText
} from 'server/lib/db';
import {makeTransactionRequest} from 'server/db/client';
import {OrderItemValidatorRequest} from 'server/api/v1/validators/order-item';

const TABLE_NAME = 'order_item';

export class OrderItemProvider {
    static async getOrderItems(orderId: string, query: Record<string, any>) {
        const {limit, offset} = seizePaginationParams(query);

        const {rows} = await makeRequest({
            text: `
                SELECT
                    good_item.id as good_item_id,
                    order_item.id as order_item_id,
                    good_item.type,
                    good_item.model,
                    good_item.brand,
                    good_item.color,
                    good_item.memory_capacity,
                    good_item.original,
                    good_item.search_tags,
                    order_item.serial_number,
                    order_item.imei
                FROM order_item
                    INNER JOIN good_item ON order_item.good_item_id = good_item.id
                WHERE order_id=$1
                LIMIT ${limit} OFFSET ${offset};
            `,
            values: [orderId]
        });

        return rows;
    }

    static async createOrderItem(client: PoolClient, rawBody: Record<string, any>) {
        const body = OrderItemValidatorRequest.validateOrderItemCreate(rawBody);
        const {fields, values} = makeInsertParams(body);
        const text = makeInsertText(TABLE_NAME, fields);
        const {rows} = await makeTransactionRequest(client, {text, values});
        return rows[0];
    }

    static async updateOrderItem(client: PoolClient, id: string, rawBody: Record<string, any>) {
        const body = OrderItemValidatorRequest.validateOrderItemUpdate(rawBody);
        const {fields, values} = makeInsertParams(body);
        const text = makeUpdateText(TABLE_NAME, fields);
        const {rows} = await makeTransactionRequest(client, {
            text,
            values: [id, ...values]
        });

        return rows[0];
    }

    static async deleteOrderItem(client: PoolClient, id: string) {
        const text = makeDeleteText(TABLE_NAME);
        const {rows} = await makeTransactionRequest(client, {text, values: [id]});
        return rows[0];
    }
}
