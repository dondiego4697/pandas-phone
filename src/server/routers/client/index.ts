import * as express from 'express';
import * as util from 'util';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';

import {IClientData} from 'front/client/models/client-data';
import {formBundleUrl} from 'server/lib/client-urls';
import {isMobile} from 'server/lib/mobile-check';

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

export const clientRouter = express.Router();

clientRouter.get('/', wrap<Request, Response>(async (req, res) => {
    const name = isMobile(req) ? 'mobile' : 'browser';

    const clientData: IClientData = {};
    const params: IRenderParams = {
        meta: {
            title: 'IOA'
        },
        urls: {
            bundle: {
                css: '',
                js: formBundleUrl(`client-${name}`, 'js')
            }
        },
        clientData: JSON.stringify(clientData)
    };

    await renderPage(req, res, params);
}));

async function renderPage(req: Request, res: Response, params: IRenderParams) {
    const render = await util.promisify<string, IRenderParams, string>(res.render.bind({req}));
    const code = await render('client', params);
    res.send(code);
}
