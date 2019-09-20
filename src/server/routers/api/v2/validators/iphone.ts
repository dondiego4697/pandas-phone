import * as Boom from '@hapi/boom';
import * as Joi from '@hapi/joi';

const iphoneBarSchema = Joi.object().keys({
    model: Joi.string().required(),
    color: Joi.string().required(),
    memory_capacity: Joi.string().required(),
    price: Joi.number().positive().required(),
    discount: Joi.number().min(0).max(100).default(0)
});

const iphoneSchema = Joi.object().keys({
    model: Joi.string().required(),
    color: Joi.string().required(),
    memory_capacity: Joi.string().required(),
    price: Joi.number().positive().required(),
    discount: Joi.number().min(0).max(100).default(0),
    serial_number: Joi.string().allow('', null),
    imei: Joi.string().allow('', null)
});

export class IphoneValidatorRequest {
    static validateIphoneBarCreate(body: Record<string, any>) {
        const result = Joi.validate(body, iphoneBarSchema);
        if (result.error) {
            throw Boom.badRequest(result.error.details.map(({message}) => message).join(', '));
        }

        return result.value;
    }

    static validateIphoneCreate(body: Record<string, any>) {
        const result = Joi.validate(body, iphoneSchema);
        if (result.error) {
            throw Boom.badRequest(result.error.details.map(({message}) => message).join(', '));
        }

        return result.value;
    }
}
