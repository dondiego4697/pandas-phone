import {PoolClient} from 'pg';

import {makeRequest} from 'server/db/client';
import {seizePaginationParams, makeInsert} from 'server/lib/db';
import {makeTransactionRequest} from 'server/db/client';

const TABLE_NAMES = {
    airpodBar: 'airpod_bar',
    airpodOrder: 'airpod_order'
};

export class AirpodProvider {
    static async getAirpodEnums() {
        const data = await Promise.all([
            'AIRPOD_SERIES_T'
        ].map(async (key) => makeRequest({
            text: `SELECT unnest(enum_range(NULL::${key}))::text;`,
            values: []
        })));

        return {
            series: data[0]!.rows.map((x) => x.unnest)
        };
    }

    static async getAirpodBarItemsAll() {
        const {rows} = await makeRequest({
            text: `SELECT * FROM ${TABLE_NAMES.airpodBar} ORDER BY discount DESC, series;`,
            values: []
        });

        return rows;
    }

    static async getAirpodBarItems(query: Record<string, any>) {
        const pagination = seizePaginationParams(query);

        const data = await makeRequest({
            text: `
                SELECT * FROM ${TABLE_NAMES.airpodBar}
                LIMIT ${pagination.limit} OFFSET ${pagination.offset};
            `,
            values: []
        });

        return data.rows;
    }

    static async createAirpodBarItem(client: PoolClient, body: Record<string, any>) {
        const {names, values} = makeInsert(body);

        const {rows} = await makeTransactionRequest(client, {
            text: `
                INSERT INTO ${TABLE_NAMES.airpodBar}
                (${names.join(', ')})
                VALUES (${names.map((_, i) => `$${i + 1}`).join(', ')})
                RETURNING *;
            `,
            values
        });

        return rows;
    }

    static async updateAirpodBarItem(client: PoolClient, id: string, body: Record<string, any>) {
        const {names, values} = makeInsert(body);

        const {rows} = await makeTransactionRequest(client, {
            text: `
                UPDATE ${TABLE_NAMES.airpodBar}
                SET (${names.join(', ')})=(${names.map((_, i) => `$${i + 2}`).join(', ')})
                WHERE id=$1 RETURNING *;
            `,
            values: [id, ...values]
        });

        return rows;
    }

    static async deleteAirpodBarItem(client: PoolClient, id: string) {
        const {rows} = await makeTransactionRequest(client, {
            text: `DELETE FROM ${TABLE_NAMES.airpodBar} WHERE id=$1 RETURNING *;`,
            values: [id]
        });

        return rows;
    }

    static async createAirpodItem(client: PoolClient, body: Record<string, any>) {
        const {names, values} = makeInsert(body);
        const {rows} = await makeTransactionRequest(client, {
            text: `
                INSERT INTO ${TABLE_NAMES.airpodOrder}
                (${names.join(', ')}) VALUES (${names.map((_, i) => `$${i + 1}`).join(', ')})
                RETURNING *;
            `,
            values
        });

        return rows;
    }

    static async updateAirpodItem(client: PoolClient, id: string, body: Record<string, any>) {
        const {names, values} = makeInsert(body);
        const {rows} = await makeTransactionRequest(client, {
            text: `
                UPDATE ${TABLE_NAMES.airpodOrder}
                SET (${names.join(', ')})=(${names.map((_, i) => `$${i + 2}`).join(', ')})
                WHERE id=$1 RETURNING *;
            `,
            values: [id, ...values]
        });

        return rows;
    }

    static async deleteAirpodItem(client: PoolClient, id: string) {
        const {rows} = await makeTransactionRequest(client, {
            text: `DELETE FROM ${TABLE_NAMES.airpodOrder} WHERE id=$1 RETURNING *;`,
            values: [id]
        });

        return rows;
    }
}
