import * as express from 'express';
import * as util from 'util';
import {Request, Response} from 'express';
import {wrap} from 'async-middleware';

import {formBundleUrl} from 'server/lib/client-urls';
import {config} from 'server/config';
import {telegramAuth} from 'server/middlewares/telegram-auth';
import {isMobile} from 'server/lib/mobile-check';

import {IAdminClientData} from 'common/types';
import {dbAllowedValues} from 'common/db-allowed-values';

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
    .use(telegramAuth)
    .get('*', wrap<Request, Response>(async (req, res) => {
        if (isMobile(req)) {
            req.adminForbidden = true;
        }

        const clientData: IAdminClientData = {
            forbidden: req.adminForbidden || false,
            telegramBotName: config['telegram.botName'],
            dbAllowedValues
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
