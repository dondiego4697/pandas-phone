import * as Boom from '@hapi/boom';
import * as Joi from '@hapi/joi';

import {getDbAllowedKeys} from 'common/db-allowed-values';

const goodItemCreateSchema = Joi.object().keys({
    type: Joi.string().valid(getDbAllowedKeys('goodItem.type')).required(),
    model: Joi.string()
        .valid([
            ...getDbAllowedKeys('goodItem.airpod.model'),
            ...getDbAllowedKeys('goodItem.iphone.model')
        ])
        .optional().allow(null),
    brand: Joi.string()
        .valid(getDbAllowedKeys('goodItem.brand'))
        .optional().allow(null),
    color: Joi.string()
        .valid([
            ...getDbAllowedKeys('goodItem.airpod.color'),
            ...getDbAllowedKeys('goodItem.iphone.color')
        ])
        .optional().allow(null),
    memory_capacity: Joi.number()
        .valid(getDbAllowedKeys('goodItem.iphone.memoryCapacity')).optional().allow(null),
    original: Joi.boolean().optional(),
    search_tags: Joi.array().items(
        Joi.string().valid(getDbAllowedKeys('goodItem.searchTag'))
    ).optional(),
    price: Joi.number().positive().required(),
    discount: Joi.number().min(0).max(100).optional(),
    public: Joi.boolean().optional()
});

const goodItemUpdateSchema = goodItemCreateSchema.append({
    type: Joi.string().valid(getDbAllowedKeys('goodItem.type')).optional(),
    price: Joi.number().positive().optional()
}).min(1);

export class GoodItemValidatorRequest {
    static validateGoodItemCreate(body: Record<string, any>) {
        const result = Joi.validate(body, goodItemCreateSchema);
        if (result.error) {
            throw Boom.badRequest(result.error.details.map(({message}) => message).join(', '));
        }

        return result.value;
    }

    static validateGoodItemUpdate(body: Record<string, any>) {
        const result = Joi.validate(body, goodItemUpdateSchema);
        if (result.error) {
            throw Boom.badRequest(result.error.details.map(({message}) => message).join(', '));
        }

        return result.value;
    }
}
