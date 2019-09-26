import * as Boom from '@hapi/boom';
import * as Joi from '@hapi/joi';

const orderItemCreateSchema = Joi.object().keys({
    order_id: Joi.string().guid().required(),
    good_item_id: Joi.string().guid().required(),
    serial_number: Joi.string().optional().allow(null),
    imei: Joi.string().optional().allow(null)
});

const orderItemUpdateSchema = orderItemCreateSchema.append({
    order_id: Joi.string().optional(),
    good_item_id: Joi.string().optional()
}).min(1);

export class OrderItemValidatorRequest {
    static validateOrderItemCreate(body: Record<string, any>) {
        const result = Joi.validate(body, orderItemCreateSchema);
        if (result.error) {
            throw Boom.badRequest(result.error.details.map(({message}) => message).join(', '));
        }

        return result.value;
    }

    static validateOrderItemUpdate(body: Record<string, any>) {
        const result = Joi.validate(body, orderItemUpdateSchema);
        if (result.error) {
            throw Boom.badRequest(result.error.details.map(({message}) => message).join(', '));
        }

        return result.value;
    }
}
