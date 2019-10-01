import * as Boom from '@hapi/boom';
import * as Joi from '@hapi/joi';

import {dbAllowedValues} from 'common/db-allowed-values';

const goodItemCreateSchema = Joi.object().keys({
    type: Joi.string().valid(dbAllowedValues['goodItem.type']).required(),
    model: Joi.string()
        .valid(
            dbAllowedValues['goodItem.airpod.model']
                .concat(dbAllowedValues['goodItem.iphone.model'])
        )
        .optional().allow(null),
    brand: Joi.string()
        .valid(dbAllowedValues['goodItem.brand'])
        .optional().allow(null),
    color: Joi.string()
        .valid(
            dbAllowedValues['goodItem.airpod.color']
                .concat(dbAllowedValues['goodItem.iphone.color'])
        )
        .optional().allow(null),
    memory_capacity: Joi.number()
        .valid(dbAllowedValues['goodItem.iphoneMemoryCapacity']).optional().allow(null),
    original: Joi.boolean().optional(),
    search_tags: Joi.array().items(
        Joi.string().valid(dbAllowedValues['goodItem.searchTag'])
    ).min(1).optional().allow(null),
    price: Joi.number().positive().required(),
    discount: Joi.number().min(0).max(100).optional(),
    public: Joi.boolean().optional()
});

const goodItemUpdateSchema = goodItemCreateSchema.append({
    type: Joi.string().valid(dbAllowedValues['goodItem.type']).optional(),
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
