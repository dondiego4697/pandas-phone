import * as Boom from '@hapi/boom';
import * as Joi from '@hapi/joi';

import {makeRequest} from 'server/db/client';
import {seizePaginationParams, makeWhere, makeInsert} from 'server/lib/db';

const insertSchema = Joi.object().keys({
    good_pattern_id: Joi.string().required(),
    serial_number: Joi.string().allow(''),
    imei: Joi.string().allow(''),
    price: Joi.number().positive().required(),
    discount: Joi.number().min(0).max(100).allow(''),
    customer_name: Joi.string().allow(''),
    customer_email: Joi.string().allow(''),
    customer_phone: Joi.string().allow(''),
    is_called: Joi.bool().allow(''),
    order_date: Joi.string().required(),
    sold_date: Joi.string().allow('')
});

export class Order {
    static async getItems(query: Record<string, any>) {
        const pagination = seizePaginationParams(query);

        const whereParams = makeWhere(query);
        const whereText = whereParams.pairsText.length > 0 ?
            `WHERE ${whereParams.pairsText.join(' AND ')}` :
            '';

        const data = await makeRequest({
            text: `
                SELECT * FROM "order"
                ${whereText !== '' ? `${whereText} AND sold_date IS NULL` : 'WHERE sold_date IS NULL'}
                LIMIT ${pagination.limit} OFFSET ${pagination.offset};
            `,
            values: [...whereParams.values]
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
                UPDATE "order"
                SET (${names.join(', ')})=(${names.map((_, i) => `$${i + 2}`).join(', ')})
                WHERE id=$1 RETURNING *;
            `,
            values: [id, ...values].map((x) => x === '' ? null : x)
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
                INSERT INTO "order"
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
}
