import * as express from 'express';
import * as util from 'util';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import * as Boom from '@hapi/boom';

import {AppState as AdminData} from 'front/admin/app-state';
import {formBundleUrl} from 'server/lib/client-urls';

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

adminRouter.get('/', wrap<Request, Response>(async (req, res) => {
    if (req.browserClient.mobile || req.browserClient.tablet) {
        throw Boom.forbidden();
    }

    const params: RenderParams = {
        meta: {
            title: 'IOA'
        },
        urls: {
            bundle: {
                css: '',
                js: formBundleUrl(req, 'admin', 'js')
            }
        },
        adminData: JSON.stringify({
            foo: 1
        } as AdminData)
    };

    await renderPage(req, res, params);
}));

async function renderPage(req: Request, res: Response, params: RenderParams) {
    const render = await util.promisify<string, RenderParams, string>(res.render.bind({req}));
    const code = await render('admin', params);
    res.send(code);
}
