import * as Boom from '@hapi/boom';
import * as Joi from '@hapi/joi';

import {makeRequest} from 'server/db/client';
import {makeInsert} from 'server/lib/db';

const schema = Joi.object().keys({
    series: Joi.string().required(),
    original: Joi.bool().default(false),
    charging_case: Joi.bool().default(false),
    price: Joi.number().positive().required(),
    discount: Joi.number().min(0).max(100).default(0),
    serial_number: Joi.string().allow('', null)
});

const TABLE_NAME = 'airpod';

export class Airpod {
    static async getEnums() {
        const data = await Promise.all(['AIRPOD_SERIES_T'].map(async (key) => {
            return makeRequest({
                text: `SELECT unnest(enum_range(NULL::${key}))::text;`,
                values: []
            });
        }));

        return {
            series: data[0]!.rows.map((x) => x.unnest)
        };
    }

    static async insertItem(body: Record<string, any>) {
        const result = Joi.validate(body, schema);
        if (result.error) {
            throw Boom.badRequest(result.error.details.map(({message}) => message).join(', '));
        }

        const {names, values} = makeInsert(result.value);
        const data = await makeRequest({
            text: `
                INSERT INTO ${TABLE_NAME}
                (${names.join(', ')})
                VALUES (${names.map((_, i) => `$${i + 1}`).join(', ')})
                RETURNING *;
            `,
            values: [...values]
        });

        return data.rows;
    }

    static async updateItem(id: string, body: Record<string, any>) {
        const result = Joi.validate(body, schema);
        if (result.error) {
            throw Boom.badRequest(result.error.details.map(({message}) => message).join(', '));
        }

        const {names, values} = makeInsert(result.value);
        const data = await makeRequest({
            text: `
                UPDATE ${TABLE_NAME}
                SET (${names.join(', ')})=(${names.map((_, i) => `$${i + 2}`).join(', ')})
                WHERE id=$1 RETURNING *;
            `,
            values: [id, ...values]
        });

        return data.rows;
    }

    static async deleteItem(id: string) {
        const data = await makeRequest({
            text: `DELETE FROM ${TABLE_NAME} WHERE id=$1 RETURNING *;`,
            values: [id]
        });

        return data.rows;
    }
}
