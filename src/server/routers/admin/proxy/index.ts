import * as express from 'express';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';

export const adminProxyRouter = express.Router();

adminProxyRouter.get('/smth', wrap<Request, Response>(async (req, res) => {
    // TODO настроить безопасность, чтобы никто не ходил сюда, кроме залогиненных админов
    res.send('asdasd');
}));
