import * as express from 'express';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';

import {IphoneProvider} from 'server/routers/api/v2/providers/iphone';

export const orderIphoneRouter = express.Router();

orderIphoneRouter.get('/enums', wrap<Request, Response>(async (_, res) => {
    res.json(await IphoneProvider.getIphoneEnums());
}));
