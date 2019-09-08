/* import * as Boom from '@hapi/boom';
import * as Joi from '@hapi/joi';

import {makeRequest} from 'server/db/client';

const createSchema = Joi.object().keys({
    good_id: Joi.string().required(),
    serial_number: Joi.string(),
    imei: Joi.string(),
    price: Joi.number().required().positive(),
    discount: Joi.number().max(100).min(0)
});

export class Shop {
    static async getItems() {
        const data = await makeRequest({
            text: `SELECT * FROM shop;`,
            values: []
        });

        if (!data) {
            throw Boom.badData();
        }

        return data.rows;
    }

    static async createItem(body: Record<string, any>) {
        const result = Joi.validate(body, createSchema);
        if (result.error) {
            throw Boom.badRequest(result.error.details.map(({message}) => message).join(', '));
        }

        const data = await makeRequest({
            text: `INSERT INTO shop (
                good_id,
                serial_number,
                imei,
                price,
                discount
            ) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
            values: [
                body.good_id,
                body.serial_number,
                body.imei,
                body.price,
                body.discount
            ]
        });

        if (!data) {
            throw Boom.badData();
        }

        return data.rows;
    }

    static async deleteItem(body: Record<string, any>) {
        const {id} = body;
        if (!id) {
            throw Boom.badRequest();
        }

        const data = await makeRequest({
            text: `DELETE FROM shop WHERE id = $1 RETURNING *;`,
            values: [id]
        });

        if (!data) {
            throw Boom.badData();
        }

        return data.rows;
    }
}
 */
