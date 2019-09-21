import * as express from 'express';
import * as cors from 'cors';
import * as Boom from '@hapi/boom';

import {telegramAuth} from 'server/middlewares/telegram-auth';
import {orderRouter} from 'server/routers/api/v2/routers/order';
import {orderAirpodRouter} from 'server/routers/api/v2/routers/order/airpod';
import {orderIphoneRouter} from 'server/routers/api/v2/routers/order/iphone';
import {barAirpodRouter} from 'server/routers/api/v2/routers/bar/airpod';
import {barIphoneRouter} from 'server/routers/api/v2/routers/bar/iphone';
import {publicRouter} from 'server/routers/api/v2/routers/public';
import {config} from 'server/config';

export const apiRouter = express.Router();

apiRouter
    .use(cors({origin: config['cors.origin']}))
    .use('/public', publicRouter);

apiRouter
    .use(telegramAuth)
    .use((req, _, next) => {
        if (req.adminForbidden) {
            throw Boom.forbidden();
        }

        next();
    })
    .use('/order', orderRouter)
    .use('/order_iphone', orderIphoneRouter)
    .use('/order_airpod', orderAirpodRouter)
    .use('/bar_iphone', barIphoneRouter)
    .use('/bar_airpod', barAirpodRouter);
