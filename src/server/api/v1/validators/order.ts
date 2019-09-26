import * as Boom from '@hapi/boom';
import * as Joi from '@hapi/joi';

const orderCreateSchema = Joi.object().keys({
    customer_name: Joi.string().required(),
    customer_phone: Joi.string().required()
});

const orderUpdateSchema = Joi.object().keys({
    customer_name: Joi.string().optional(),
    customer_phone: Joi.string().optional(),
    called: Joi.boolean().optional(),
    _status_v1: Joi.string().optional()
}).min(1);

export class OrderValidatorRequest {
    static validateOrderCreate(body: Record<string, any>) {
        const result = Joi.validate(body, orderCreateSchema);
        if (result.error) {
            throw Boom.badRequest(result.error.details.map(({message}) => message).join(', '));
        }

        return result.value;
    }

    static validateOrderUpdate(body: Record<string, any>) {
        const result = Joi.validate(body, orderUpdateSchema);
        if (result.error) {
            throw Boom.badRequest(result.error.details.map(({message}) => message).join(', '));
        }

        return result.value;
    }
}
