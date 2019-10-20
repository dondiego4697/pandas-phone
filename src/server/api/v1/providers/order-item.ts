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

import {IGetOrderItemResponse} from 'common/types';
import {IOrderItemDbModel} from 'common/models/order-item';

const TABLE_NAME = 'order_item';
const ORDER_ITEM_SELECT = `
    good_item.id as good_item_id,
    order_item.id as order_item_id,
    order_item.order_id,
    good_item.type,
    good_item.model,
    good_item.brand,
    good_item.color,
    good_item.memory_capacity,
    good_item.original,
    good_item.search_tags,
    good_item.price,
    good_item.discount,
    good_item.public,
    good_item.updated,
    order_item.serial_number,
    order_item.imei
`;

export class OrderItemProvider {
    static async getOrderItem(orderItemId: string): Promise<IGetOrderItemResponse> {
        const {rows} = await makeRequest({
            text: `
                SELECT
                    ${ORDER_ITEM_SELECT}
                FROM order_item
                    INNER JOIN good_item ON order_item.good_item_id = good_item.id
                WHERE order_item.id=$1;
            `,
            values: [orderItemId]
        });

        const data = rows[0];
        return {
            orderItem: {
                id: data.order_item_id,
                good_item_id: data.good_item_id,
                order_id: data.order_id,
                serial_number: data.serial_number,
                imei: data.imei
            },
            goodItem: {
                id: data.good_item_id,
                type: data.type,
                model: data.model,
                brand: data.brand,
                color: data.color,
                memory_capacity: data.memory_capacity,
                original: data.original,
                search_tags: data.search_tags,
                price: data.price,
                discount: data.discount,
                public: data.public,
                updated: data.updated
            }
        };
    }

    static async getOrderItems(orderId: string, query: Record<string, any>): Promise<IGetOrderItemResponse[]> {
        const {limit, offset} = seizePaginationParams(query);

        const {rows} = await makeRequest({
            text: `
                SELECT
                    ${ORDER_ITEM_SELECT}
                FROM order_item
                    INNER JOIN good_item ON order_item.good_item_id = good_item.id
                WHERE order_id=$1
                LIMIT ${limit} OFFSET ${offset};
            `,
            values: [orderId]
        });

        return rows.map((data) => ({
            orderItem: {
                id: data.order_item_id,
                good_item_id: data.good_item_id,
                order_id: data.order_id,
                serial_number: data.serial_number,
                imei: data.imei
            },
            goodItem: {
                id: data.good_item_id,
                type: data.type,
                model: data.model,
                brand: data.brand,
                color: data.color,
                memory_capacity: data.memory_capacity,
                original: data.original,
                search_tags: data.search_tags,
                price: data.price,
                discount: data.discount,
                public: data.public,
                updated: data.updated
            }
        }));
    }

    static async createOrderItem(client: PoolClient, rawBody: Record<string, any>): Promise<IOrderItemDbModel> {
        const body = OrderItemValidatorRequest.validateOrderItemCreate(rawBody);
        const {fields, values} = makeInsertParams(body);
        const text = makeInsertText(TABLE_NAME, fields);
        const {rows} = await makeTransactionRequest(client, {text, values});
        return rows[0];
    }

    static async updateOrderItem(
        client: PoolClient,
        id: string,
        rawBody: Record<string, any>
    ): Promise<IOrderItemDbModel> {
        const body = OrderItemValidatorRequest.validateOrderItemUpdate(rawBody);
        const {fields, values} = makeInsertParams(body);
        const text = makeUpdateText(TABLE_NAME, fields);
        const {rows} = await makeTransactionRequest(client, {
            text,
            values: [id, ...values]
        });

        return rows[0];
    }

    static async deleteOrderItem(client: PoolClient, id: string): Promise<IOrderItemDbModel> {
        const text = makeDeleteText(TABLE_NAME);
        const {rows} = await makeTransactionRequest(client, {text, values: [id]});
        return rows[0];
    }
}
