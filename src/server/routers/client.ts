import * as express from 'express';
import * as util from 'util';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';

import {formBundleUrl} from 'server/lib/client-urls';

import {IClientClientData} from 'common/types';

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

clientRouter.get('*', wrap<Request, Response>(async (req, res) => {
    const clientData: IClientClientData = {
        socialLinks: {
            vk: 'https://vk.com/pandaphone12',
            instagram: 'https://www.instagram.com/pandaphone12/'
        }
    };
    const params: IRenderParams = {
        meta: {
            title: 'Panda Phone'
        },
        urls: {
            bundle: {
                css: formBundleUrl('client', 'css'),
                js: formBundleUrl('client', 'js')
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
