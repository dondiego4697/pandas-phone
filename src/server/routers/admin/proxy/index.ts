import * as express from 'express';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import * as Boom from '@hapi/boom';

export const adminProxyRouter = express.Router();

adminProxyRouter.use((req, _res, next) => {
    if (req.adminForbidden) {
        throw Boom.forbidden();
    }

    next();
});

adminProxyRouter.get('/smth', wrap<Request, Response>(async (req, res) => {
    res.send('asdasd');
}));
