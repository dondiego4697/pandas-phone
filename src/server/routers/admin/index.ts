import * as express from 'express';
import * as util from 'util';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';

import {AppState as AdminData} from 'front/admin/app-state';
import {formBundleUrl} from 'server/lib/client-urls';
import {adminProxyRouter} from 'server/routers/admin/proxy';

import {telegramAuth} from 'server/middlewares/telegram-auth';

export const adminRouter = express.Router();

interface RenderParams {
    meta: {
        title: string;
    };
    urls: {
        bundle: {
            css: string;
            js: string;
        };
    };
    adminData: string;
}

adminRouter
    .use(telegramAuth)
    .use('/proxy', adminProxyRouter)
    .get('/', wrap<Request, Response>(async (req, res) => {
        if (req.browserClient.mobile || req.browserClient.tablet) {
            req.adminForbidden = true;
        }

        const params: RenderParams = {
            meta: {
                title: 'Root'
            },
            urls: {
                bundle: {
                    css: formBundleUrl('admin', 'css'),
                    js: formBundleUrl('admin', 'js')
                }
            },
            adminData: JSON.stringify({
                adminForbidden: req.adminForbidden || false
            } as AdminData)
        };

        await renderPage(req, res, params);
    }));

async function renderPage(req: Request, res: Response, params: RenderParams) {
    const render = await util.promisify<string, RenderParams, string>(res.render.bind({req}));
    const code = await render('admin', params);
    res.send(code);
}
