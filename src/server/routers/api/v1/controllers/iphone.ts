import * as Boom from '@hapi/boom';
import * as Joi from '@hapi/joi';

import {makeRequest} from 'server/db/client';
import {makeInsert} from 'server/lib/db';

const schema = Joi.object().keys({
    model: Joi.string().required(),
    color: Joi.string().required(),
    memory_capacity: Joi.string().required(),
    price: Joi.number().positive().required(),
    discount: Joi.number().min(0).max(100).default(0),
    serial_number: Joi.string().allow('', null),
    imei: Joi.string().allow('', null)
});

const TABLE_NAME = 'iphone';

export class Iphone {
    static async getEnums() {
        const data = await Promise.all(['IPHONE_MODEL_T', 'IPHONE_MEMORY_T', 'IPHONE_COLOR_T'].map(async (key) => {
            return makeRequest({
                text: `SELECT unnest(enum_range(NULL::${key}))::text;`,
                values: []
            });
        }));

        return {
            models: data[0]!.rows.map((x) => x.unnest),
            memories: data[1]!.rows.map((x) => x.unnest),
            colors: data[2]!.rows.map((x) => x.unnest)
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
