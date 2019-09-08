import * as express from 'express';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import * as Boom from '@hapi/boom';

import {GoodPattern} from 'server/routers/proxy/controllers/good-pattern';
import {GoodBrand} from 'server/routers/proxy/controllers/good-brand';
import {Schema} from 'server/routers/proxy/controllers/schema';

import {telegramAuth} from 'server/middlewares/telegram-auth';

export const proxyRouter = express.Router();

proxyRouter
    .use(telegramAuth)
    .use((req, res, next) => {
        // if request === post ? check admin
        // if request === get ? allow, but I will think about secure in this way
        if (req.adminForbidden) {
            throw Boom.forbidden();
        }

        next();
    });

proxyRouter.get('/tables', wrap<Request, Response>(async (req, res) => {
    res.json(await Schema.getTables());
}));

proxyRouter.get('/good-pattern', wrap<Request, Response>(async (req, res) => {
    res.json(await GoodPattern.getItems(req.query));
}));

proxyRouter.get('/good-brand', wrap<Request, Response>(async (req, res) => {
    res.json(await GoodBrand.getItems(req.query));
}));

proxyRouter.get('/good-brand/columns', wrap<Request, Response>(async (_req, res) => {
    res.json(await GoodBrand.getColumns());
}));
