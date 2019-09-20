import * as express from 'express';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';

import {AirpodProvider} from 'server/routers/api/v2/providers/airpod';
import {AirpodValidatorRequest} from 'server/routers/api/v2/validators/airpod';
import {getPgClient} from 'server/db/client';

export const barAirpodRouter = express.Router();

barAirpodRouter.get('/items', wrap<Request, Response>(async (req, res) => {
    res.json(await AirpodProvider.getAirpodBarItems(req.query));
}));

barAirpodRouter.post('/create', wrap<Request, Response>(async (req, res) => {
    const body = AirpodValidatorRequest.validateAirpodBarCreate(req.body);

    const client = await getPgClient();
    try {
        res.json(await AirpodProvider.createAirpodBarItem(client, body));
    } finally {
        client.release();
    }
}));

barAirpodRouter.post('/update/:id', wrap<Request, Response>(async (req, res) => {
    const body = AirpodValidatorRequest.validateAirpodBarCreate(req.body);

    const client = await getPgClient();
    try {
        res.json(await AirpodProvider.updateAirpodBarItem(client, req.params.id, body));
    } finally {
        client.release();
    }
}));

barAirpodRouter.delete('/:id', wrap<Request, Response>(async (req, res) => {
    const client = await getPgClient();
    try {
        res.json(await AirpodProvider.deleteAirpodBarItem(client, req.params.id));
    } finally {
        client.release();
    }
}));
