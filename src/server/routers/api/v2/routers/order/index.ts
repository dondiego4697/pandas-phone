import * as express from 'express';
import * as Boom from '@hapi/boom';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';

import {getPgClient, makeTransactionRequest} from 'server/db/client';
import {OrderProvider} from 'server/routers/api/v2/providers/order';
import {OrderValidatorRequest} from 'server/routers/api/v2/validators/order';
import {AirpodValidatorRequest} from 'server/routers/api/v2/validators/airpod';
import {AirpodProvider} from 'server/routers/api/v2/providers/airpod';
import {IphoneValidatorRequest} from 'server/routers/api/v2/validators/iphone';
import {IphoneProvider} from 'server/routers/api/v2/providers/iphone';

export const orderRouter = express.Router();

orderRouter.get('/enums', wrap<Request, Response>(async (_, res) => {
    res.json(await OrderProvider.getOrderEnums());
}));

orderRouter.get('/opened', wrap<Request, Response>(async (req, res) => {
    res.json(await OrderProvider.getOpenedOrders(req.query));
}));

orderRouter.get('/:id/items', wrap<Request, Response>(async (req, res) => {
    res.json(await OrderProvider.getOrderItems(req.params.id));
}));

orderRouter.get('/:id/get', wrap<Request, Response>(async (req, res) => {
    res.json(await OrderProvider.getOrder(req.params.id));
}));

orderRouter.post('/create', wrap<Request, Response>(async (req, res) => {
    const body = OrderValidatorRequest.validateOrderCreate(req.body);

    const client = await getPgClient();
    try {
        res.json(await OrderProvider.createOrder(client, body));
    } finally {
        client.release();
    }
}));

orderRouter.post('/:id/update_status', wrap<Request, Response>(async (req, res) => {
    const status = OrderValidatorRequest.validateOrderStatus(req.body.status);

    const client = await getPgClient();
    try {
        res.json(await OrderProvider.updateOrderStatus(client, req.params.id, status));
    } finally {
        client.release();
    }
}));

orderRouter.post('/:id/update', wrap<Request, Response>(async (req, res) => {
    const body = OrderValidatorRequest.validateOrderCreate(req.body);

    const client = await getPgClient();
    try {
        res.json(await OrderProvider.updateOrder(client, req.params.id, body));
    } finally {
        client.release();
    }
}));

orderRouter.post('/:id/action_airpod/:method', wrap<Request, Response>(async (req, res) => {
    const {body: bodyRaw, params: {id: orderId, method}} = req;
    OrderValidatorRequest.validateOrderActionMethod(method);

    if (method === 'create') {
        const body = AirpodValidatorRequest.validateAirpodCreate(bodyRaw);
        const client = await getPgClient();
        try {
            await makeTransactionRequest(client, {text: 'BEGIN'});
            const [item] = await AirpodProvider.createAirpodItem(client, body);
            await OrderProvider.addAirpodOrder(client, orderId, item.id);
            await makeTransactionRequest(client, {text: 'COMMIT'});
            res.json(item);
        } catch (err) {
            await makeTransactionRequest(client, {text: 'ROLLBACK'});
            throw err;
        } finally {
            client.release();
        }
    } else if (method === 'delete') {
        const {id} = bodyRaw;
        const client = await getPgClient();
        try {
            await makeTransactionRequest(client, {text: 'BEGIN'});
            await OrderProvider.deleteAirpodOrder(client, orderId, id);
            const [item] = await AirpodProvider.deleteAirpodItem(client, id);
            await makeTransactionRequest(client, {text: 'COMMIT'});
            res.json(item);
        } catch (err) {
            await makeTransactionRequest(client, {text: 'ROLLBACK'});
            throw err;
        } finally {
            client.release();
        }
    } else if (method === 'update') {
        const {id} = bodyRaw;
        delete bodyRaw.id;

        const body = AirpodValidatorRequest.validateAirpodCreate(bodyRaw);

        const client = await getPgClient();
        try {
            const [item] = await AirpodProvider.updateAirpodItem(client, id, body);
            res.json(item);
        } finally {
            client.release();
        }
    } else {
        throw Boom.badRequest(`method: ${method} is not allowed`);
    }
}));

orderRouter.post('/:id/action_iphone/:method', wrap<Request, Response>(async (req, res) => {
    const {body: bodyRaw, params: {id: orderId, method}} = req;
    OrderValidatorRequest.validateOrderActionMethod(method);

    if (method === 'create') {
        const body = IphoneValidatorRequest.validateIphoneCreate(bodyRaw);
        const client = await getPgClient();
        try {
            await makeTransactionRequest(client, {text: 'BEGIN'});
            const [item] = await IphoneProvider.createIphoneItem(client, body);
            await OrderProvider.addIphoneOrder(client, orderId, item.id);
            await makeTransactionRequest(client, {text: 'COMMIT'});
            res.json(item);
        } catch (err) {
            await makeTransactionRequest(client, {text: 'ROLLBACK'});
            throw err;
        } finally {
            client.release();
        }
    } else if (method === 'delete') {
        const {id} = bodyRaw;
        const client = await getPgClient();
        try {
            await makeTransactionRequest(client, {text: 'BEGIN'});
            await OrderProvider.deleteIphoneOrder(client, orderId, id);
            const [item] = await IphoneProvider.deleteIphoneItem(client, id);
            await makeTransactionRequest(client, {text: 'COMMIT'});
            res.json(item);
        } catch (err) {
            await makeTransactionRequest(client, {text: 'ROLLBACK'});
            throw err;
        } finally {
            client.release();
        }
    } else if (method === 'update') {
        const {id} = bodyRaw;
        delete bodyRaw.id;
        const body = IphoneValidatorRequest.validateIphoneCreate(bodyRaw);

        const client = await getPgClient();
        try {
            const [item] = await IphoneProvider.updateIphoneItem(client, id, body);
            res.json(item);
        } finally {
            client.release();
        }
    } else {
        throw Boom.badRequest(`method: ${method} is not allowed`);
    }
}));
