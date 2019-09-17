import * as Boom from '@hapi/boom';
import * as Joi from '@hapi/joi';

import {makeRequest} from 'server/db/client';
import {seizePaginationParams, makeInsert} from 'server/lib/db';

const schema = Joi.object().keys({
    series: Joi.string().required(),
    is_original: Joi.bool().default(false),
    is_charging_case: Joi.bool().default(false),
    price: Joi.number().positive().required(),
    discount: Joi.number().min(0).max(100).default(0),
    serial_number: Joi.string(),
    is_sold: Joi.boolean().default(false),
    is_bar: Joi.boolean().default(false)
});

const TABLE_NAME = 'airpod';

export class Airpod {
    static async getBarItems() {
        const airpods = await makeRequest({
            text: `SELECT * FROM airpod WHERE is_bar=true ORDER BY series DESC;`,
            values: []
        });

        return airpods.rows;
    }

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

    static async getItems(query: Record<string, any>) {
        const pagination = seizePaginationParams(query);

        const data = await makeRequest({
            text: `
                SELECT * FROM ${TABLE_NAME}
                WHERE is_sold=false
                LIMIT ${pagination.limit} OFFSET ${pagination.offset};
            `,
            values: []
        });

        return data.rows;
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
