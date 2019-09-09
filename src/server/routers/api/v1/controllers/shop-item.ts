import * as Boom from '@hapi/boom';

import {makeRequest} from 'server/db/client';
import {seizePaginationParams, makeWhere} from 'server/lib/db';

export class ShopItem {
    static async getColumns() {
        const data = await makeRequest({
            text: `
                SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS
                WHERE table_name = 'shop_item';
            `,
            values: []
        });

        if (!data) {
            throw Boom.badData();
        }

        return data.rows.map((row) => row.column_name);
    }

    static async getItems(query: Record<string, any>) {
        const pagination = seizePaginationParams(query);

        const whereParams = makeWhere(query);
        const whereText = whereParams.pairsText.length > 0 ?
            `WHERE ${whereParams.pairsText.join(' AND ')}` :
            '';

        const data = await makeRequest({
            text: `
                SELECT * FROM shop_item
                ${whereText}
                LIMIT ${pagination.limit} OFFSET ${pagination.offset};
            `,
            values: [...whereParams.values]
        });

        if (!data) {
            throw Boom.badData();
        }

        return data.rows;
    }
}
