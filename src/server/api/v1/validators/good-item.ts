import * as Boom from '@hapi/boom';
import * as Joi from '@hapi/joi';

import {dbAllowedValues} from 'common/db-allowed-values';

const goodItemCreateSchema = Joi.object().keys({
    type: Joi.string().valid(dbAllowedValues.goodItemType).required(),
    model: Joi.string().optional().allow(null),
    brand: Joi.string().optional().allow(null),
    color: Joi.string().optional().allow(null),
    memory_capacity: Joi.number().optional().allow(null),
    original: Joi.boolean().optional(),
    search_tags: Joi.array().items(
        Joi.string().valid(dbAllowedValues.searchTags)
    ).min(1).optional().allow(null),
    price: Joi.number().positive().required(),
    discount: Joi.number().min(0).max(100).optional(),
    public: Joi.boolean().optional()
});

const goodItemUpdateSchema = goodItemCreateSchema.append({
    type: Joi.string().valid(dbAllowedValues.goodItemType).optional(),
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
