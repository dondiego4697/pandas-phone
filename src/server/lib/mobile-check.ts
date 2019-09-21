import {Request} from 'express';

export function isMobile(req: Request): boolean {
    const browserClient = req.browserClient;
    if (
        browserClient.iphone ||
        browserClient.ipod ||
        browserClient.operaMini ||
        browserClient.operaMobile ||
        browserClient.mobileSafari ||
        browserClient.android ||
        browserClient.blackberry ||
        browserClient.mobile ||
        browserClient.tablet
    ) {
        return true;
    }

    return false;
}
