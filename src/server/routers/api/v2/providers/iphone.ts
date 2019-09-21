import {PoolClient} from 'pg';

import {makeRequest} from 'server/db/client';
import {seizePaginationParams, makeInsert} from 'server/lib/db';
import {makeTransactionRequest} from 'server/db/client';

const TABLE_NAMES = {
    iphoneBar: 'iphone_bar',
    iphoneOrder: 'iphone_order'
};

export class IphoneProvider {
    static async getIphoneEnums() {
        const data = await Promise.all([
            'IPHONE_MODEL_T',
            'IPHONE_MEMORY_T',
            'IPHONE_COLOR_T'
        ].map(async (key) => makeRequest({
            text: `SELECT unnest(enum_range(NULL::${key}))::text;`,
            values: []
        })));

        return {
            models: data[0]!.rows.map((row) => row.unnest),
            memories: data[1]!.rows.map((row) => row.unnest),
            colors: data[2]!.rows.map((row) => row.unnest)
        };
    }

    static async getIphoneBarItemsAll() {
        const {rows} = await makeRequest({
            text: `SELECT * FROM ${TABLE_NAMES.iphoneBar} ORDER BY discount DESC, model;`,
            values: []
        });

        return rows;
    }

    static async getIphoneBarItems(query: Record<string, any>) {
        const pagination = seizePaginationParams(query);

        const data = await makeRequest({
            text: `
                SELECT * FROM ${TABLE_NAMES.iphoneBar}
                LIMIT ${pagination.limit} OFFSET ${pagination.offset};
            `,
            values: []
        });

        return data.rows;
    }

    static async createIphoneBarItem(client: PoolClient, body: Record<string, any>) {
        const {names, values} = makeInsert(body);

        const {rows} = await makeTransactionRequest(client, {
            text: `
                INSERT INTO ${TABLE_NAMES.iphoneBar}
                (${names.join(', ')})
                VALUES (${names.map((_, i) => `$${i + 1}`).join(', ')})
                RETURNING *;
            `,
            values
        });

        return rows;
    }

    static async updateIphoneBarItem(client: PoolClient, id: string, body: Record<string, any>) {
        const {names, values} = makeInsert(body);

        const {rows} = await makeTransactionRequest(client, {
            text: `
                UPDATE ${TABLE_NAMES.iphoneBar}
                SET (${names.join(', ')})=(${names.map((_, i) => `$${i + 2}`).join(', ')})
                WHERE id=$1 RETURNING *;
            `,
            values: [id, ...values]
        });

        return rows;
    }

    static async deleteIphoneBarItem(client: PoolClient, id: string) {
        const {rows} = await makeTransactionRequest(client, {
            text: `DELETE FROM ${TABLE_NAMES.iphoneBar} WHERE id=$1 RETURNING *;`,
            values: [id]
        });

        return rows;
    }

    static async createIphoneItem(client: PoolClient, body: Record<string, any>) {
        const {names, values} = makeInsert(body);
        const {rows} = await makeTransactionRequest(client, {
            text: `
                INSERT INTO ${TABLE_NAMES.iphoneOrder}
                (${names.join(', ')}) VALUES (${names.map((_, i) => `$${i + 1}`).join(', ')})
                RETURNING *;
            `,
            values
        });

        return rows;
    }

    static async updateIphoneItem(client: PoolClient, id: string, body: Record<string, any>) {
        const {names, values} = makeInsert(body);
        const {rows} = await makeTransactionRequest(client, {
            text: `
                UPDATE ${TABLE_NAMES.iphoneOrder}
                SET (${names.join(', ')})=(${names.map((_, i) => `$${i + 2}`).join(', ')})
                WHERE id=$1 RETURNING *;
            `,
            values: [id, ...values]
        });

        return rows;
    }

    static async deleteIphoneItem(client: PoolClient, id: string) {
        const {rows} = await makeTransactionRequest(client, {
            text: `DELETE FROM ${TABLE_NAMES.iphoneOrder} WHERE id=$1 RETURNING *;`,
            values: [id]
        });

        return rows;
    }
}
