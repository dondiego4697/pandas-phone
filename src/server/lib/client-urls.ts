import {config} from 'server/config';

export function formBundleUrl(bundleName: string, format: 'js' | 'css'): string {
    return `${config['app.publicPath']}/${bundleName}.bundle.${format}`;
}
