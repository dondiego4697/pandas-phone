import * as express from 'express';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import * as Boom from '@hapi/boom';

import {ShopItem} from 'server/routers/api/v1/controllers/shop-item';
import {GoodPattern} from 'server/routers/api/v1/controllers/good-pattern';
import {Order} from 'server/routers/api/v1/controllers/order';
import {Schema} from 'server/routers/api/v1/controllers/schema';

import {telegramAuth} from 'server/middlewares/telegram-auth';

export const apiV1Router = express.Router();

// apiV1Router.get('/public/', () )

apiV1Router
    .use(telegramAuth)
    .use((req, res, next) => {
        if (req.adminForbidden) {
            throw Boom.forbidden();
        }

        next();
    });

apiV1Router.get('/tables', wrap<Request, Response>(async (req, res) => {
    res.json(await Schema.getTables());
}));

// SHOP-ITEM
apiV1Router.get('/shop-item', wrap<Request, Response>(async (req, res) => {
    res.json(await ShopItem.getItems(req.query));
}));

apiV1Router.get('/shop-item/columns', wrap<Request, Response>(async (_req, res) => {
    res.json(await ShopItem.getColumns());
}));

apiV1Router.post('/shop-item/create', wrap<Request, Response>(async (req, res) => {
    res.json(await ShopItem.insertItem(req.body));
}));

apiV1Router.post('/shop-item/update/:id', wrap<Request, Response>(async (req, res) => {
    res.json(await ShopItem.updateItem(req.params.id, req.body));
}));

apiV1Router.delete('/shop-item/:id', wrap<Request, Response>(async (req, res) => {
    res.json(await ShopItem.deleteItem(req.params.id));
}));

// GOOD-PATTERN
apiV1Router.get('/good-pattern', wrap<Request, Response>(async (req, res) => {
    res.json(await GoodPattern.getItems(req.query));
}));

apiV1Router.get('/good-pattern/columns', wrap<Request, Response>(async (_req, res) => {
    res.json(await GoodPattern.getColumns());
}));

apiV1Router.post('/good-pattern/create', wrap<Request, Response>(async (req, res) => {
    res.json(await GoodPattern.insertItem(req.body));
}));

apiV1Router.post('/good-pattern/update/:id', wrap<Request, Response>(async (req, res) => {
    res.json(await GoodPattern.updateItem(req.params.id, req.body));
}));

apiV1Router.delete('/good-pattern/:id', wrap<Request, Response>(async (req, res) => {
    res.json(await GoodPattern.deleteItem(req.params.id));
}));

// ORDER
apiV1Router.get('/order', wrap<Request, Response>(async (req, res) => {
    res.json(await Order.getItems(req.query));
}));

apiV1Router.get('/order/columns', wrap<Request, Response>(async (_req, res) => {
    res.json(await Order.getColumns());
}));

apiV1Router.post('/order/update/:id', wrap<Request, Response>(async (req, res) => {
    res.json(await Order.updateItem(req.params.id, req.body));
}));
