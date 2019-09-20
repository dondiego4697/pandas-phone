import * as express from 'express';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';

import {AirpodProvider} from 'server/routers/api/v2/providers/airpod';

export const orderAirpodRouter = express.Router();

orderAirpodRouter.get('/enums', wrap<Request, Response>(async (_, res) => {
    res.json(await AirpodProvider.getAirpodEnums());
}));
