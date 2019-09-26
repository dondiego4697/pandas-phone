import {PoolClient} from 'pg';

import {makeRequest} from 'server/db/client';
import {
    seizePaginationParams,
    makeInsertParams,
    makeInsertText,
    makeUpdateText,
    makeWhereParams,
    makeDeleteText
} from 'server/lib/db';
import {makeTransactionRequest} from 'server/db/client';
import {GoodItemValidatorRequest} from 'server/api/v1/validators/good-item';

const TABLE_NAME = 'good_item';

export class GoodItemProvider {
    static async getGoodItems(query: Record<string, any>) {
        const {limit, offset} = seizePaginationParams(query);
        const searchTagValues: string[] = [];

        if (query.search_tags) {
            searchTagValues.push(...query.search_tags.split('|'));
            delete query.search_tags;
        }

        const {pairs, values} = makeWhereParams(query);
        if (searchTagValues.length > 0) {
            pairs.push(`
                (
                    ${searchTagValues.map((tag) => {
                        values.push(tag);
                        return `$${values.length} = ANY (search_tags)`;
                    }).join(' OR ')}
                )`
            );
        }

        const [{rows: [total]}, {rows}] = await Promise.all([
            makeRequest({
                text: `SELECT COUNT(*) FROM ${TABLE_NAME};`,
                values: []
            }),
            makeRequest({
                text: `
                    SELECT * FROM ${TABLE_NAME}
                    ${values.length === 0 ? '' : `WHERE ${pairs.join(' AND ')}`}
                    LIMIT ${limit} OFFSET ${offset};
                `,
                values
            })
        ]);

        return {total: Number(total.count), rows};
    }

    static async createGoodItem(client: PoolClient, rawBody: Record<string, any>) {
        const body = GoodItemValidatorRequest.validateGoodItemCreate(rawBody);
        const {fields, values} = makeInsertParams(body);
        const text = makeInsertText(TABLE_NAME, fields);
        const {rows} = await makeTransactionRequest(client, {text, values});
        return rows[0];
    }

    static async updateGoodItem(client: PoolClient, id: string, rawBody: Record<string, any>) {
        const body = GoodItemValidatorRequest.validateGoodItemUpdate(rawBody);
        const {fields, values} = makeInsertParams(body);
        const text = makeUpdateText(TABLE_NAME, fields);
        const {rows} = await makeTransactionRequest(client, {
            text,
            values: [id, ...values]
        });

        return rows[0];
    }

    static async deleteGoodItem(client: PoolClient, id: string) {
        const text = makeDeleteText(TABLE_NAME);
        const {rows} = await makeTransactionRequest(client, {text, values: [id]});
        return rows[0];
    }
}
