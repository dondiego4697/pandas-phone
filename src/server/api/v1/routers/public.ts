import * as express from 'express';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';

export const publicRouter = express.Router();

publicRouter.get('/goods', wrap<Request, Response>(async (req, res) => {
    res.json({});
}));

publicRouter.post('/create_order', wrap<Request, Response>(async (req, res) => {
    res.json({});
}));
