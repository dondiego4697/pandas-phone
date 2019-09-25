import * as express from 'express';
import * as cors from 'cors';
import * as Boom from '@hapi/boom';

import {telegramAuth} from 'server/middlewares/telegram-auth';
import {orderRouter} from 'server/api/v1/routers/order';
import {orderItemRouter} from 'server/api/v1/routers/order-item';
import {goodItemRouter} from 'server/api/v1/routers/good-item';
import {publicRouter} from 'server/api/v1/routers/public';

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
    .use('/order_item', orderItemRouter)
    .use('/good_item', goodItemRouter);
