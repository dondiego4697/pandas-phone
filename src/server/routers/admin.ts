import * as express from 'express';
import * as util from 'util';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';

import {formBundleUrl} from 'server/lib/client-urls';
import {config} from 'server/config';
import {adminAuth} from 'server/middlewares/admin-auth';

import {IAdminClientData} from 'common/types';

export const adminRouter = express.Router();

interface IRenderParams {
    meta: {
        title: string;
    };
    urls: {
        bundle: {
            css: string;
            js: string;
        };
    };
    clientData: string;
}

adminRouter
    .use(adminAuth)
    .get('*', wrap<Request, Response>(async (req, res) => {
        const clientData: IAdminClientData = {
            forbidden: req.adminForbidden || false,
            authUrl: [
                'https://oauth.yandex.ru/authorize?response_type=code',
                `client_id=${process.env.PANDA_PHONE_YANDEX_OAUTH_ID}`,
                `redirect_uri=${config['admin.authRedirect']}`
            ].join('&')
        };

        const params: IRenderParams = {
            meta: {
                title: 'Bender Root'
            },
            urls: {
                bundle: {
                    css: formBundleUrl('admin', 'css'),
                    js: formBundleUrl('admin', 'js')
                }
            },
            clientData: JSON.stringify(clientData)
        };

        await renderPage(req, res, params);
    }));

async function renderPage(req: Request, res: Response, params: IRenderParams) {
    const render = await util.promisify<string, IRenderParams, string>(res.render.bind({req}));
    const code = await render('admin', params);
    res.send(code);
}
