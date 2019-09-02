import {Request} from 'express';
import {URL, URLSearchParams} from 'url';

import {config} from 'server/config';

export function formBundleUrl(req: Request, bundleName: string, format: 'js' | 'css'): string {
    const host = req.headers['x-original-host'] || req.hostname;
    return [
        `${req.protocol}://`,
        host,
        config['app.needPort'] ? `:${req.socket.localPort}` : null,
        `${config['app.publicPath']}/${bundleName}.bundle.${format}`
    ].filter(Boolean).join('');
}
