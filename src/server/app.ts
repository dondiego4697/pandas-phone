import * as fs from 'fs';
import * as assert from 'assert';
import * as express from 'express';
import * as path from 'path';
import {Request, Response, NextFunction} from 'express';
import * as Boom from '@hapi/boom';
import * as mustache from 'mustache';
import * as browserClient from 'browser-client';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';

import {logger} from 'server/lib/logger';
import {config} from 'server/config';

import {adminRouter} from 'server/routers/admin';
import {apiRouter} from 'server/routers/api/v2';
import {clientRouter} from 'server/routers/client';

declare global {
    namespace Express {
        // tslint:disable-next-line
        interface Request {
            browserClient: {
                iphone: boolean;
                ipod: boolean;
                ipad: boolean;
                operaMini: boolean;
                operaMobile: boolean;
                mobileSafari: boolean;
                android: boolean;
                blackberry: boolean;
                mobile: boolean;
                tablet: boolean;
            };
            adminForbidden?: boolean;
        }
    }
}

export const app = express()
    .disable('trust proxy')
    .disable('x-powered-by')
    .use(cookieParser())
    .use(bodyParser.json())
    .engine('mustache', (filePath, options, callback) => {
        callback(null, mustache.render(
            fs.readFileSync(filePath, 'utf-8'),
            options,
            {},
            ['{tmpl:"', '"}']
        ));
    })
    .set('view engine', 'mustache')
    .set('views', path.resolve('./res/views'))
    .get('/ping', (_req: Request, res: Response) => res.end())
    .use('/favicon.ico', express.static(path.resolve('./res/imgs/favicon.ico')));

if (config['app.isNodeStatic']) {
    app.use(config['app.publicPath'], express.static(path.resolve('./out/src/front')));
    app.use(`${config['app.publicPath']}/imgs`, express.static(path.resolve('./res/imgs')));
}

app
    .use(browserClient())
    .use('/bender-root', adminRouter)
    .use('/api/v2', apiRouter)
    .use('/*', clientRouter);

app.use((_req, _res, next) => next(Boom.notFound('Endpoint not found')));
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    if (Boom.isBoom(err)) {
        sendError(res, err);
    } else {
        logger.error(err.stack || err);
        sendError(res, Boom.internal(err));
    }
});

function sendError(res: Response, err: Boom): void {
    res.status(err.output.statusCode).json(err.output.payload);
}

if (!module.parent) {
    const port = getCustomPort() || 3000;
    app.listen(port, () => {
        logger.info(`Application started on port ${port}`);
    });
}

function getCustomPort(): number | undefined {
    if (process.env.NODEJS_PORT === undefined) {
        return;
    }

    const port = parseInt(process.env.NODEJS_PORT, 10);
    assert(!isNaN(port), 'Environment variable MAPS_NODEJS_PORT must be an integer');
    return port;
}
