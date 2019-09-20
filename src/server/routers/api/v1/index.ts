import * as express from 'express';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import * as Boom from '@hapi/boom';
import * as cors from 'cors';

import {Iphone} from 'server/routers/api/v1/controllers/iphone';
import {Airpod} from 'server/routers/api/v1/controllers/airpod';
import {Order} from 'server/routers/api/v1/controllers/order';
import {IphoneBar} from 'server/routers/api/v1/controllers/iphone-bar';
import {AirpodBar} from 'server/routers/api/v1/controllers/airpod-bar';
import {config} from 'server/config';

import {telegramAuth} from 'server/middlewares/telegram-auth';

export const apiV1Router = express.Router();

apiV1Router
    .use(cors({origin: config['cors.origin']}))
    .get('/public/bar-items', wrap<Request, Response>(async (req, res) => {
        const iphones = await IphoneBar.getAllItems();
        const airpods = await AirpodBar.getAllItems();

        res.json({
            iphones: iphones.map((iphone) => ({
                id: iphone.id,
                model: iphone.model,
                color: iphone.color,
                memory: iphone.memory_capacity,
                price: iphone.price,
                discount: iphone.discount
            })),
            airpods: airpods.map((airpod) => ({
                id: airpod.id,
                series: airpod.series,
                original: airpod.original,
                charging: airpod.charging_case,
                price: airpod.price,
                discount: airpod.discount
            }))
        });
    }))
    .post('/public/add-order', wrap<Request, Response>(async (req, res) => {
        res.json(await Order.addCustomerOrder(req.body));
    }));

apiV1Router
    .use(telegramAuth)
    .use((req, res, next) => {
        if (req.adminForbidden) {
            throw Boom.forbidden();
        }

        next();
    });

// ENUMS
apiV1Router.get('/order/enums', wrap<Request, Response>(async (req, res) => {
    res.json(await Order.getEnums());
}));

apiV1Router.get('/iphone/enums', wrap<Request, Response>(async (req, res) => {
    res.json(await Iphone.getEnums());
}));

apiV1Router.get('/airpod/enums', wrap<Request, Response>(async (req, res) => {
    res.json(await Airpod.getEnums());
}));

// BAR OF IPHONES
apiV1Router.get('/bar/iphones', wrap<Request, Response>(async (req, res) => {
    res.json(await IphoneBar.getItems(req.query));
}));

apiV1Router.post('/bar/iphone/create', wrap<Request, Response>(async (req, res) => {
    res.json(await IphoneBar.insertItem(req.body));
}));

apiV1Router.post('/bar/iphone/update/:id', wrap<Request, Response>(async (req, res) => {
    res.json(await IphoneBar.updateItem(req.params.id, req.body));
}));

apiV1Router.delete('/bar/iphone/:id', wrap<Request, Response>(async (req, res) => {
    res.json(await IphoneBar.deleteItem(req.params.id));
}));

// BAR OF AIRPODS
apiV1Router.get('/bar/airpods', wrap<Request, Response>(async (req, res) => {
    res.json(await AirpodBar.getItems(req.query));
}));

apiV1Router.post('/bar/airpod/create', wrap<Request, Response>(async (req, res) => {
    res.json(await AirpodBar.insertItem(req.body));
}));

apiV1Router.post('/bar/airpod/update/:id', wrap<Request, Response>(async (req, res) => {
    res.json(await AirpodBar.updateItem(req.params.id, req.body));
}));

apiV1Router.delete('/bar/airpod/:id', wrap<Request, Response>(async (req, res) => {
    res.json(await AirpodBar.deleteItem(req.params.id));
}));

// ORDERS
apiV1Router.get('/orders/opened', wrap<Request, Response>(async (req, res) => {
    res.json(await Order.getOpenedOrders(req.query));
}));

apiV1Router.get('/order/:id/items', wrap<Request, Response>(async (req, res) => {
    res.json(await Order.getOrderItems(req.params.id));
}));

apiV1Router.get('/order/id/:id', wrap<Request, Response>(async (req, res) => {
    res.json(await Order.getOrder(req.params.id));
}));

apiV1Router.post('/order/update/:id/status', wrap<Request, Response>(async (req, res) => {
    res.json(await Order.changeOrderStatus(req.params.id, req.body.status));
}));

apiV1Router.post('/order/update/:id', wrap<Request, Response>(async (req, res) => {
    res.json(await Order.updateOrder(req.params.id, req.body));
}));

apiV1Router.post('/order/:id/airpod/:method', wrap<Request, Response>(async (req, res) => {
    const {id: orderId, method} = req.params;
    const {body} = req;

    if (method === 'add') {
        const [item] = await Airpod.insertItem(body);
        await Order.addAirpodOrder(orderId, item.id);
        res.json(item);
    } else if (method === 'delete') {
        const {id} = body;
        await Order.deleteAirpodOrder(orderId, id);
        const [item] = await Airpod.deleteItem(id);
        res.json(item);
    } else if (method === 'update') {
        const {id} = body;
        delete body.id;
        const [item] = await Airpod.updateItem(id, body);
        res.json(item);
    } else {
        throw Boom.badRequest(`method: ${method} is not allowed`);
    }
}));

apiV1Router.post('/order/:id/iphone/:method', wrap<Request, Response>(async (req, res) => {
    const {id: orderId, method} = req.params;
    const {body} = req;

    if (method === 'add') {
        const [item] = await Iphone.insertItem(body);
        await Order.addIphoneOrder(orderId, item.id);
        res.json(item);
    } else if (method === 'delete') {
        const {id} = body;
        await Order.deleteIphoneOrder(orderId, id);
        const [item] = await Iphone.deleteItem(id);
        res.json(item);
    } else if (method === 'update') {
        const {id} = body;
        delete body.id;
        const [item] = await Iphone.updateItem(id, body);
        res.json(item);
    } else {
        throw Boom.badRequest(`method: ${method} is not allowed`);
    }
}));
