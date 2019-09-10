import * as express from 'express';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import * as Boom from '@hapi/boom';

import {Iphone} from 'server/routers/api/v1/controllers/iphone';
import {Airpods} from 'server/routers/api/v1/controllers/airpods';
import {Order} from 'server/routers/api/v1/controllers/order';

import {telegramAuth} from 'server/middlewares/telegram-auth';

export const apiV1Router = express.Router();

apiV1Router
    .use(telegramAuth)
    .use((req, res, next) => {
        if (req.adminForbidden) {
            throw Boom.forbidden();
        }

        next();
    });

// IPHONE
apiV1Router.get('/iphone', wrap<Request, Response>(async (req, res) => {
    res.json(await Iphone.getItems(req.query));
}));

apiV1Router.get('/iphone/enums', wrap<Request, Response>(async (req, res) => {
    res.json(await Iphone.getEnums());
}));

apiV1Router.post('/iphone/create', wrap<Request, Response>(async (req, res) => {
    res.json(await Iphone.insertItem(req.body));
}));

apiV1Router.post('/iphone/update/:id', wrap<Request, Response>(async (req, res) => {
    res.json(await Iphone.updateItem(req.params.id, req.body));
}));

apiV1Router.delete('/iphone/:id', wrap<Request, Response>(async (req, res) => {
    res.json(await Iphone.deleteItem(req.params.id));
}));

// AIRPODS
apiV1Router.get('/airpods', wrap<Request, Response>(async (req, res) => {
    res.json(await Airpods.getItems(req.query));
}));

apiV1Router.get('/airpods/enums', wrap<Request, Response>(async (req, res) => {
    res.json(await Airpods.getEnums());
}));

apiV1Router.post('/airpods/create', wrap<Request, Response>(async (req, res) => {
    res.json(await Airpods.insertItem(req.body));
}));

apiV1Router.post('/airpods/update/:id', wrap<Request, Response>(async (req, res) => {
    res.json(await Airpods.updateItem(req.params.id, req.body));
}));

apiV1Router.delete('/airpods/:id', wrap<Request, Response>(async (req, res) => {
    res.json(await Airpods.deleteItem(req.params.id));
}));

// ORDER
apiV1Router.get('/order/opened', wrap<Request, Response>(async (req, res) => {
    res.json(await Order.getOpenedOrders(req.query));
}));

apiV1Router.get('/order/enums', wrap<Request, Response>(async (req, res) => {
    res.json(await Order.getEnums());
}));

apiV1Router.get('/order/:id/items', wrap<Request, Response>(async (req, res) => {
    res.json(await Order.getOrderItems(req.params.id));
}));

apiV1Router.post('/order/update/:id', wrap<Request, Response>(async (req, res) => {
    res.json(await Order.updateOrder(req.params.id, req.body));
}));
