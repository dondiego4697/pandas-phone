import {URL} from 'url';
import * as got from 'got';

import {logger} from 'server/lib/logger';

interface IOptions {
    method: 'POST' | 'GET';
    query?: Record<string, any>;
    body?: any;
    headers?: Record<string, any>;
    json?: boolean;
    timeout?: number;
}

export async function request(url: URL, options: IOptions): Promise<got.Response<any>> {
    const requestInfo = [
        `${options.method} => ${url}`,
        `query=${JSON.stringify(options.query)}`,
        `body=${JSON.stringify(options.body)}`
    ].join(' ');
    logger.debug(`Request ${requestInfo}`);

    let res: got.Response<any>;
    try {
        res = await got(url, {
            method: options.method.toLowerCase(),
            ...(options.json ? {json: true} : {}),
            timeout: options.timeout || 2000,
            ...(options.method === 'GET' ? {query: options.query} : {}),
            ...(options.method === 'POST' ? {body: options.body} : {}),
            headers: options.headers
        });
    } catch (err) {
        logger.error(`Request ${requestInfo} failed: ${err}, ${JSON.stringify(err)}`);
        throw err;
    }

    const checkResLogMessage = `Got response for ${requestInfo}: ` +
        `statusCode=${res.statusCode}, body=${JSON.stringify(res.body)}`;

    if (res.statusCode < 200 && res.statusCode >= 300) {
        logger.error(checkResLogMessage);
    }

    return res;
}
