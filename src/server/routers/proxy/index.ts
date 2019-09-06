import * as express from 'express';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import * as Boom from '@hapi/boom';

import {GoodType} from 'server/routers/proxy/controllers/good-type';
import {GoodBrand} from 'server/routers/proxy/controllers/good-brand';
import {GoodBrandProduct} from 'server/routers/proxy/controllers/good-brand-product';
import {Good} from 'server/routers/proxy/controllers/good';
import {Shop} from 'server/routers/proxy/controllers/shop';
import {ShopStatistic} from 'server/routers/proxy/controllers/shop-statistic';

import {telegramAuth} from 'server/middlewares/telegram-auth';

export const proxyRouter = express.Router();

proxyRouter
    .use(telegramAuth)
    .use((req, _res, next) => {
        // TODO check telegram Auth only on !get requests
        // TODO check allow-original-access host on get requests
        if (req.adminForbidden) {
            throw Boom.forbidden();
        }

        next();
    });

proxyRouter.get('/good-type', wrap<Request, Response>(async (req, res) => {
    res.json(await GoodType.getItems(req.query));
}));

proxyRouter.post('/good-type', wrap<Request, Response>(async (req, res) => {
    res.json(await GoodType.createItem(req.body));
}));

proxyRouter.get('/good-brand', wrap<Request, Response>(async (req, res) => {
    res.json(await GoodBrand.getItems(req.query));
}));

proxyRouter.post('/good-brand', wrap<Request, Response>(async (req, res) => {
    res.json(await GoodBrand.createItem(req.body));
}));

proxyRouter.get('/good-brand-product', wrap<Request, Response>(async (req, res) => {
    res.json(await GoodBrandProduct.getItems(req.query));
}));

proxyRouter.post('/good-brand-product', wrap<Request, Response>(async (req, res) => {
    res.json(await GoodBrandProduct.createItem(req.body));
}));

proxyRouter.get('/good', wrap<Request, Response>(async (req, res) => {
    res.json(await Good.getItems(req.query));
}));

proxyRouter.post('/good', wrap<Request, Response>(async (req, res) => {
    res.json(await Good.createItem(req.body));
}));

proxyRouter.get('/shop', wrap<Request, Response>(async (req, res) => {
    res.json(await Shop.getItems(req.query));
}));

proxyRouter.post('/shop', wrap<Request, Response>(async (req, res) => {
    res.json(await Shop.createItem(req.body));
}));

proxyRouter.delete('/shop', wrap<Request, Response>(async (req, res) => {
    res.json(await Shop.deleteItem(req.body));
}));

proxyRouter.get('/shop-statistic', wrap<Request, Response>(async (req, res) => {
    res.json(await ShopStatistic.getItems(req.query));
}));

proxyRouter.post('/shop-statistic', wrap<Request, Response>(async (req, res) => {
    res.json(await ShopStatistic.createItem(req.body));
}));
