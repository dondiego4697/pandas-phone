import * as util from 'util';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';
import * as Boom from '@hapi/boom';

import AdminData from 'front/admin/app-state';
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
    adminData: string;
}

export const buildAdminMiddleware = wrap<Request, Response>(async (req, res) => {
    if (req.browserClient.mobile || req.browserClient.tablet) {
        throw Boom.forbidden();
    }

    const render = await util.promisify<string, RenderParams, string>(res.render.bind({req}));
    const code = await render('admin', {
        meta: {
            title: 'Root panel'
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
    });
    res.send(code);
});
