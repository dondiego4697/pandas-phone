import * as util from 'util';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';

import ClientData from 'client/app-state';
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

export const buildMiddleware = wrap<Request, Response>(async (req, res) => {
    const name = req.browserClient.mobile || req.browserClient.tablet ? 'mobile' : 'browser';

    const render = await util.promisify<string, RenderParams, string>(res.render.bind({req}));
    const code = await render('index', {
        meta: {
            title: 'IOA'
        },
        urls: {
            bundle: {
                css: '',
                js: formBundleUrl(req, name, 'js')
            }
        },
        clientData: JSON.stringify({
            foo: 1
        } as ClientData)
    });
    res.send(code);
});
