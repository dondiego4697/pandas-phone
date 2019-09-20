import * as Boom from '@hapi/boom';
import * as Joi from '@hapi/joi';

const airpodBarSchema = Joi.object().keys({
    series: Joi.string().required(),
    original: Joi.bool().default(false),
    charging_case: Joi.bool().default(false),
    price: Joi.number().positive().required(),
    discount: Joi.number().min(0).max(100).default(0)
});

const airpodSchema = Joi.object().keys({
    series: Joi.string().required(),
    original: Joi.bool().default(false),
    charging_case: Joi.bool().default(false),
    price: Joi.number().positive().required(),
    discount: Joi.number().min(0).max(100).default(0),
    serial_number: Joi.string().allow('', null)
});

export class AirpodValidatorRequest {
    static validateAirpodBarCreate(body: Record<string, any>) {
        const result = Joi.validate(body, airpodBarSchema);
        if (result.error) {
            throw Boom.badRequest(result.error.details.map(({message}) => message).join(', '));
        }

        return result.value;
    }

    static validateAirpodCreate(body: Record<string, any>) {
        const result = Joi.validate(body, airpodSchema);
        if (result.error) {
            throw Boom.badRequest(result.error.details.map(({message}) => message).join(', '));
        }

        return result.value;
    }
}
