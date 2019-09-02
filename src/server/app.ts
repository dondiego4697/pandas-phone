import * as fs from 'fs';
import * as assert from 'assert';
import * as express from 'express';
import * as path from 'path';
import {Request, Response, NextFunction} from 'express';
import * as Boom from '@hapi/boom';
import * as mustache from 'mustache';
import * as browserClient from 'browser-client';

import {logger} from 'server/lib/logger';
import {config} from 'server/config';

import {buildMiddleware} from 'middlewares/builder';

declare global {
    namespace Express {
        interface Request {
            browserClient: {
                desktop: boolean;
                tablet: boolean;
                mobile: boolean;
            };
        }
    }
}

const paths = ['/'];

export const app = express()
    .disable('trust proxy')
    .disable('x-powered-by')
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
    .get('/ping', (_req: Request, res: Response) => res.end());

if (config['app.isNodeStatic']) {
    app.use(config['app.publicPath'], express.static(path.resolve('./out/src/client')));
}

app
    .use(browserClient())
    .get(paths, buildMiddleware);

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
    const port = getCustomPort() || 8080;
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
