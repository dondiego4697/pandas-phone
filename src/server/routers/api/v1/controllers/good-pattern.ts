import * as Boom from '@hapi/boom';
import * as Joi from '@hapi/joi';

import {makeRequest} from 'server/db/client';
import {seizePaginationParams, makeWhere, makeInsert} from 'server/lib/db';

const insertSchema = Joi.object().keys({
    title: Joi.string().allow(null, ''),
    description: Joi.string().allow(null, ''),
    brand: Joi.string().required(),
    product: Joi.string().required(),
    model: Joi.string().required(),
    color: Joi.string().required(),
    category: Joi.string().required(),
    memory_capacity: Joi.number().positive()
});

export class GoodPattern {
    static async getColumns() {
        const data = await makeRequest({
            text: `
                SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS
                WHERE table_name = 'good_pattern';
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
                SELECT * FROM good_pattern
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

    static async insertItem(body: Record<string, any>) {
        const result = Joi.validate(body, insertSchema);
        if (result.error) {
            throw Boom.badRequest(result.error.details.map(({message}) => message).join(', '));
        }

        const {names, values} = makeInsert(result.value);
        const data = await makeRequest({
            text: `
                INSERT INTO good_pattern
                (${names.join(', ')})
                VALUES (${names.map((_, i) => `$${i + 1}`).join(', ')})
                RETURNING *;
            `,
            values: [...values]
        });

        if (!data) {
            throw Boom.badData();
        }

        return data.rows;
    }

    static async updateItem(id: string, body: Record<string, any>) {
        const result = Joi.validate(body, insertSchema);
        if (result.error) {
            throw Boom.badRequest(result.error.details.map(({message}) => message).join(', '));
        }

        const {names, values} = makeInsert(result.value);
        const data = await makeRequest({
            text: `
                UPDATE good_pattern
                SET (${names.join(', ')})=(${names.map((_, i) => `$${i + 2}`).join(', ')})
                WHERE id=$1 RETURNING *;
            `,
            values: [id, ...values]
        });

        if (!data) {
            throw Boom.badData();
        }

        return data.rows;
    }

    static async deleteItem(id: string) {
        const data = await makeRequest({
            text: `DELETE FROM good_pattern WHERE id=$1 RETURNING *;`,
            values: [id]
        });

        if (!data) {
            throw Boom.badData();
        }

        return data.rows;
    }
}
