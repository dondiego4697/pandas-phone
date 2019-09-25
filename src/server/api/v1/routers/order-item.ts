import * as express from 'express';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';

export const orderItemRouter = express.Router();

orderItemRouter.get('/', wrap<Request, Response>(async (req, res) => {
    res.json({});
}));

orderItemRouter.post('/create', wrap<Request, Response>(async (req, res) => {
    res.json({});
}));

orderItemRouter.post('/:id/update', wrap<Request, Response>(async (req, res) => {
    res.json({});
}));

orderItemRouter.post('/:id/delete', wrap<Request, Response>(async (req, res) => {
    res.json({});
}));
