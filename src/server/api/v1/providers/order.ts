import {PoolClient} from 'pg';

import {makeRequest} from 'server/db/client';
import {
    seizePaginationParams,
    makeInsertParams,
    makeInsertText,
    makeUpdateText
} from 'server/lib/db';
import {makeTransactionRequest} from 'server/db/client';
import {OrderValidatorRequest} from 'server/api/v1/validators/order';
import {IGetOrdersResponse} from 'common/types';
import {IOrderDbModel} from 'common/models/order';
import {TelegramBot} from 'lib/telegram-bot';

const TABLE_NAME = 'orders';

export class OrderProvider {
    static async getOpenedOrders(query: Record<string, any>): Promise<IGetOrdersResponse> {
        const pagination = seizePaginationParams(query);

        const [{rows: [total]}, {rows}] = await Promise.all([
            makeRequest({
                text: `SELECT COUNT(*) FROM ${TABLE_NAME};`,
                values: []
            }),
            makeRequest({
                text: `
                    SELECT * FROM ${TABLE_NAME}
                    ORDER BY order_date DESC
                    LIMIT ${pagination.limit} OFFSET ${pagination.offset};
                `,
                values: []
            })
        ]);

        return {total: Number(total.count), rows};
    }

    static async getOrder(id: string): Promise<IOrderDbModel> {
        const {rows} = await makeRequest({
            text: `SELECT * FROM ${TABLE_NAME} WHERE id=$1;`,
            values: [id]
        });

        return rows[0];
    }

    static async createOrder(client: PoolClient, rawBody: Record<string, any>): Promise<IOrderDbModel> {
        const body = OrderValidatorRequest.validateOrderCreate(rawBody);
        const {fields, values} = makeInsertParams(body);
        const text = makeInsertText(TABLE_NAME, fields);
        const {rows} = await makeTransactionRequest(client, {text, values});
        return rows[0];
    }

    static async updateOrder(client: PoolClient, id: string, rawBody: Record<string, any>): Promise<IOrderDbModel> {
        const body = OrderValidatorRequest.validateOrderUpdate(rawBody);
        const {fields, values} = makeInsertParams(body);
        const text = makeUpdateText(TABLE_NAME, fields);
        const {rows} = await makeTransactionRequest(client, {
            text,
            values: [id, ...values]
        });

        if (rows[0] && body._status_v1) {
            TelegramBot.sendMessageToWorkChat(TelegramBot.messageMakeOrderResolution(id, body._status_v1));
        }

        return rows[0];
    }
}
