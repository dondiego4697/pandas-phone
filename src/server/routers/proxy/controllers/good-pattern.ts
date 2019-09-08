import * as Boom from '@hapi/boom';

import {makeRequest} from 'server/db/client';
import {seizePaginationParams, makeWhere} from 'server/lib/db';

export class GoodPattern {
    static async getItems(query: Record<string, any>) {
        const pagination = seizePaginationParams(query);

        const whereParams = makeWhere(query);
        const data = await makeRequest({
            text: `
                SELECT * FROM good_pattern
                WHERE ${whereParams.pairsText.join(' AND ')}
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
