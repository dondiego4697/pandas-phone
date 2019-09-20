import * as express from 'express';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';

import {IphoneProvider} from 'server/routers/api/v2/providers/iphone';
import {IphoneValidatorRequest} from 'server/routers/api/v2/validators/iphone';
import {getPgClient} from 'server/db/client';

export const barIphoneRouter = express.Router();

barIphoneRouter.get('/items', wrap<Request, Response>(async (req, res) => {
    res.json(await IphoneProvider.getIphoneBarItems(req.query));
}));

barIphoneRouter.post('/create', wrap<Request, Response>(async (req, res) => {
    const body = IphoneValidatorRequest.validateIphoneBarCreate(req.body);

    const client = await getPgClient();
    try {
        res.json(await IphoneProvider.createIphoneBarItem(client, body));
    } finally {
        client.release();
    }
}));

barIphoneRouter.post('/update/:id', wrap<Request, Response>(async (req, res) => {
    const body = IphoneValidatorRequest.validateIphoneBarCreate(req.body);

    const client = await getPgClient();
    try {
        res.json(await IphoneProvider.updateIphoneBarItem(client, req.params.id, body));
    } finally {
        client.release();
    }
}));

barIphoneRouter.delete('/:id', wrap<Request, Response>(async (req, res) => {
    const client = await getPgClient();
    try {
        res.json(await IphoneProvider.deleteIphoneBarItem(client, req.params.id));
    } finally {
        client.release();
    }
}));
