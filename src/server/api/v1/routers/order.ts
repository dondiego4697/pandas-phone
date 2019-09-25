import * as express from 'express';
import * as Boom from '@hapi/boom';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';

import {getPgClient} from 'server/db/client';
import {OrderProvider} from 'server/api/v1/providers/order';

export const orderRouter = express.Router();

orderRouter.get('/', wrap<Request, Response>(async (req, res) => {
    res.json(await OrderProvider.getOpenedOrders(req.query));
}));

orderRouter.get('/:id', wrap<Request, Response>(async (req, res) => {
    const result = await OrderProvider.getOrder(req.params.id);
    if (!result) {
        throw Boom.notFound();
    }

    res.json(await OrderProvider.getOrder(req.params.id));
}));

orderRouter.post('/create', wrap<Request, Response>(async (req, res) => {
    const client = await getPgClient();
    try {
        res.json(await OrderProvider.createOrder(client, req.body));
    } finally {
        client.release();
    }
}));

orderRouter.post('/:id/update', wrap<Request, Response>(async (req, res) => {
    const client = await getPgClient();
    try {
        res.json(await OrderProvider.updateOrder(client, req.params.id, req.body));
    } finally {
        client.release();
    }
}));
