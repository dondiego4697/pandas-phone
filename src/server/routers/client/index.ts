import * as express from 'express';
import * as util from 'util';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';

import {AppState as ClientData} from 'front/client/app-state';
import {formBundleUrl} from 'server/lib/client-urls';

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
    clientData: string;
}

export const clientRouter = express.Router();

clientRouter.get('/', wrap<Request, Response>(async (req, res) => {
    const name = req.browserClient.mobile || req.browserClient.tablet ? 'mobile' : 'browser';

    const params: RenderParams = {
        meta: {
            title: 'IOA'
        },
        urls: {
            bundle: {
                css: '',
                js: formBundleUrl(`client-${name}`, 'js')
            }
        },
        clientData: JSON.stringify({
            foo: 1
        } as ClientData)
    };

    await renderPage(req, res, params);
}));

async function renderPage(req: Request, res: Response, params: RenderParams) {
    const render = await util.promisify<string, RenderParams, string>(res.render.bind({req}));
    const code = await render('client', params);
    res.send(code);
}
