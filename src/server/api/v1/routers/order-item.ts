import * as express from 'express';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';

import {getPgClient} from 'server/db/client';
import {OrderItemProvider} from 'server/api/v1/providers/order-item';

export const orderItemRouter = express.Router();

orderItemRouter.get('/:id', wrap<Request, Response>(async (req, res) => {
    res.json(await OrderItemProvider.getOrderItem(req.params.id));
}));

orderItemRouter.post('/create', wrap<Request, Response>(async (req, res) => {
    const client = await getPgClient();
    try {
        res.json(await OrderItemProvider.createOrderItem(client, req.body));
    } finally {
        client.release();
    }
}));

orderItemRouter.post('/:id/update', wrap<Request, Response>(async (req, res) => {
    const client = await getPgClient();
    try {
        res.json(await OrderItemProvider.updateOrderItem(client, req.params.id, req.body));
    } finally {
        client.release();
    }
}));

orderItemRouter.post('/:id/delete', wrap<Request, Response>(async (req, res) => {
    const client = await getPgClient();
    try {
        res.json(await OrderItemProvider.deleteOrderItem(client, req.params.id));
    } finally {
        client.release();
    }
}));
