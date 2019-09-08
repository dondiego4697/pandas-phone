import * as Boom from '@hapi/boom';

import {makeRequest} from 'server/db/client';

export class Schema {
    static async getTables(): Promise<string[]> {
        const data = await makeRequest({
            text: `
                SELECT table_name FROM information_schema.tables
                WHERE table_schema='public'
                AND table_name != 'admin';
            `,
            values: []
        });

        if (!data) {
            throw Boom.badData();
        }

        return data.rows.map((row) => row.table_name);
    }
}
