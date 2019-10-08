import * as assert from 'assert';
import {URL} from 'url';
import {Request, Response} from 'express';
import * as FormData from 'form-data';
import {wrap} from 'async-middleware';
import * as got from 'got';
import * as jwt from 'jsonwebtoken';

import {logger} from 'server/lib/logger';
import {request} from 'server/lib/request';
import {makeRequest} from 'server/db/client';
import {config} from 'server/config';

const PRIVATE_TOKEN = process.env.PANDA_PHONE_TELEGRAM_BOT_API_TOKEN!;
assert(PRIVATE_TOKEN, 'There is empty api token');

interface IAdminData {
    id: string;
    login: string;
}

async function checkAccess(adminData: IAdminData): Promise<boolean> {
    const res = await makeRequest({
        text: 'SELECT * FROM admin WHERE yandex_user_id=$1 AND login=$2',
        values: [adminData.id, adminData.login]
    });

    if (!res || !res.rows) {
        return false;
    }

    return res.rows.length > 0;
}

async function log(req: Request): Promise<void> {
    logger.info(`Request without token: ${JSON.stringify({
        url: req.originalUrl,
        query: req.query,
        method: req.method,
        ip: req.ip,
        headers: req.headers
    })}`);
}

async function getAuthToken(code: string): Promise<string | undefined> {
    let res: got.Response<any>;
    try {
        const url = new URL(`/token`, 'https://oauth.yandex.ru');

        const body = new FormData();
        body.append('grant_type', 'authorization_code');
        body.append('code', code);
        body.append('client_id', process.env.PANDA_PHONE_YANDEX_OAUTH_ID);
        body.append('client_secret', process.env.PANDA_PHONE_YANDEX_OAUTH_PASS);

        res = await request(url, {
            method: 'POST',
            body
        });
    } catch (_) {
        return;
    }

    if (res.statusCode === 200) {
        return JSON.parse(res.body).access_token;
    }
}

async function getAdminData(authToken: string): Promise<IAdminData | undefined> {
    let checkRes: got.Response<any>;
    try {
        const url = new URL(`/info`, 'https://login.yandex.ru');
        checkRes = await request(url, {
            method: 'GET',
            json: true,
            query: {
                format: 'json'
            },
            headers: {
                Authorization: `OAuth ${authToken}`
            }
        });
    } catch (err) {
        return;
    }

    if (checkRes.statusCode === 200) {
        return {
            id: checkRes.body.id,
            login: checkRes.body.login
        };
    }
}

export const adminAuth = wrap<Request, Response>(async (req, res, next) => {
    if (config['admin.disableAuth']) {
        req.adminForbidden = false;
        next();
        return;
    }

    const adminSessionToken = req.cookies['admin_session'];
    const code = req.query.code;
    delete req.query.code;

    if (!code && !adminSessionToken) {
        req.adminForbidden = true;
        next();
        return;
    }

    if (!adminSessionToken) {
        log(req);

        const authToken = await getAuthToken(code);
        if (!authToken) {
            req.adminForbidden = true;
            next();
            return;
        }

        const adminData = await getAdminData(authToken);
        if (!adminData) {
            req.adminForbidden = true;
            next();
            return;
        }

        const token = jwt.sign(adminData, PRIVATE_TOKEN);
        res.cookie('admin_session', token, {maxAge: 60 * 60 * 1000});
        res.redirect('/bender-root');
        return;
    } else {
        try {
            const adminData = jwt.verify(adminSessionToken, PRIVATE_TOKEN) as IAdminData;
            if (!(await checkAccess(adminData))) {
                req.adminForbidden = true;
            }
        } catch (err) {
            logger.info(`Invalid token: ${err.message}`);
            req.adminForbidden = true;
        }
    }

    next();
});
