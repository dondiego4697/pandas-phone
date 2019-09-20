import * as Boom from '@hapi/boom';
import * as Joi from '@hapi/joi';

export type OrderStatus = 'new' | 'reject' | 'bought' | 'called';
export type OrderItemActionMethod = 'create' | 'update' | 'delete';

export interface IAddCustomerOrderBody {
    customer: {
        name: string;
        phone: string;
    };
    airpodIds: string[];
    iphoneIds: string[];
}

const orderSchema = Joi.object().keys({
    customer_name: Joi.string().required(),
    customer_phone: Joi.string().required(),
    status: Joi.string(),
    order_date: Joi.string(),
    sold_date: Joi.string().allow(null, '')
});

const customerOrderSchema = Joi.object().keys({
    airpodIds: Joi.array().items(Joi.string()).required(),
    iphoneIds: Joi.array().items(Joi.string()).required(),
    customer: Joi.object().keys({
        name: Joi.string().required(),
        phone: Joi.string().required()
    })
});

export class OrderValidatorRequest {
    static validateOrderCreate(body: Record<string, any>) {
        const result = Joi.validate(body, orderSchema);
        if (result.error) {
            throw Boom.badRequest(result.error.details.map(({message}) => message).join(', '));
        }

        return result.value;
    }

    static validateOrderStatus(statusRaw: string) {
        const valid: OrderStatus[] = ['new', 'called', 'bought', 'reject'];
        if (!valid.includes(statusRaw as OrderStatus)) {
            throw Boom.badRequest(`invalid status ${statusRaw}`);
        }

        return statusRaw as OrderStatus;
    }

    static validateOrderActionMethod(methodRaw: string) {
        const valid: OrderItemActionMethod[] = ['create', 'update', 'delete'];
        if (!valid.includes(methodRaw as OrderItemActionMethod)) {
            throw Boom.badRequest(`invalid method ${methodRaw}`);
        }

        return methodRaw as OrderItemActionMethod;
    }

    static validateCustomerOrderCreate(body: Record<string, any>) {
        const result = Joi.validate(body, customerOrderSchema);
        if (result.error) {
            throw Boom.badRequest(result.error.details.map(({message}) => message).join(', '));
        }

        return result.value as IAddCustomerOrderBody;
    }
}
