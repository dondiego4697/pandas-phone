import * as express from 'express';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import * as Boom from '@hapi/boom';

import {Iphone} from 'server/routers/api/v1/controllers/iphone';
import {Airpod} from 'server/routers/api/v1/controllers/airpod';
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
apiV1Router.get('/iphones', wrap<Request, Response>(async (req, res) => {
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

// AIRPOD
apiV1Router.get('/airpods', wrap<Request, Response>(async (req, res) => {
    res.json(await Airpod.getItems(req.query));
}));

apiV1Router.get('/airpod/enums', wrap<Request, Response>(async (req, res) => {
    res.json(await Airpod.getEnums());
}));

apiV1Router.post('/airpod/create', wrap<Request, Response>(async (req, res) => {
    res.json(await Airpod.insertItem(req.body));
}));

apiV1Router.post('/airpod/update/:id', wrap<Request, Response>(async (req, res) => {
    res.json(await Airpod.updateItem(req.params.id, req.body));
}));

apiV1Router.delete('/airpod/:id', wrap<Request, Response>(async (req, res) => {
    res.json(await Airpod.deleteItem(req.params.id));
}));

// ORDER
apiV1Router.get('/orders/opened', wrap<Request, Response>(async (req, res) => {
    res.json(await Order.getOpenedOrders(req.query));
}));

apiV1Router.get('/order/enums', wrap<Request, Response>(async (req, res) => {
    res.json(await Order.getEnums());
}));

apiV1Router.post('/order/update/:id', wrap<Request, Response>(async (req, res) => {
    res.json(await Order.updateOrder(req.params.id, req.body));
}));

apiV1Router.get('/order/id/:id', wrap<Request, Response>(async (req, res) => {
    res.json(await Order.getOrder(req.params.id));
}));

apiV1Router.post('/order/update/:id/status', wrap<Request, Response>(async (req, res) => {
    res.json(await Order.changeOrderStatus(req.params.id, req.body.status));
}));

apiV1Router.get('/order/:id/items', wrap<Request, Response>(async (req, res) => {
    res.json(await Order.getOrderItems(req.params.id));
}));

apiV1Router.post('/order/:id/airpod/:method', wrap<Request, Response>(async (req, res) => {
    if (req.params.method === 'add') {
        res.json(await Order.addAirpodOrder(req.params.id, req.body.id));
    } else if (req.params.method === 'delete') {
        res.json(await Order.deleteAirpodOrder(req.params.id, req.body.id));
    } else {
        throw Boom.badRequest(`method: ${req.params.method} is not allowed`);
    }
}));

apiV1Router.post('/order/:id/iphone/:method', wrap<Request, Response>(async (req, res) => {
    if (req.params.method === 'add') {
        res.json(await Order.addIphoneOrder(req.params.id, req.body.id));
    } else if (req.params.method === 'delete') {
        res.json(await Order.deleteIphoneOrder(req.params.id, req.body.id));
    } else {
        throw Boom.badRequest(`method: ${req.params.method} is not allowed`);
    }
}));
