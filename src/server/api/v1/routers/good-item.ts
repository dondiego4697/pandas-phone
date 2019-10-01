import * as express from 'express';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';

import {GoodItemProvider} from 'server/api/v1/providers/good-item';
import {getPgClient} from 'server/db/client';

export const goodItemRouter = express.Router();

goodItemRouter.get('/', wrap<Request, Response>(async (req, res) => {
    res.json(await GoodItemProvider.getGoodItems(req.query));
}));

goodItemRouter.get('/:id', wrap<Request, Response>(async (req, res) => {
    res.json(await GoodItemProvider.getGoodItem(req.params.id));
}));

goodItemRouter.post('/create', wrap<Request, Response>(async (req, res) => {
    const client = await getPgClient();
    try {
        res.json(await GoodItemProvider.createGoodItem(client, req.body));
    } finally {
        client.release();
    }
}));

goodItemRouter.post('/:id/update', wrap<Request, Response>(async (req, res) => {
    const client = await getPgClient();
    try {
        res.json(await GoodItemProvider.updateGoodItem(client, req.params.id, req.body));
    } finally {
        client.release();
    }
}));

goodItemRouter.post('/:id/delete', wrap<Request, Response>(async (req, res) => {
    const client = await getPgClient();
    try {
        res.json(await GoodItemProvider.deleteGoodItem(client, req.params.id));
    } finally {
        client.release();
    }
}));
