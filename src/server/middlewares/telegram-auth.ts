import * as assert from 'assert';
import {Request, Response} from 'express';
import * as crypto from 'crypto';
import {wrap} from 'async-middleware';
import * as jwt from 'jsonwebtoken';

import {logger} from 'server/lib/logger';
import {makeRequest} from 'server/db/client';

const PRIVATE_TOKEN = process.env.PANDA_PHONE_TELEGRAM_BOT_API_TOKEN!;
assert(PRIVATE_TOKEN, 'There is empty api token');

interface AdminData {
    id: string;
    username: string;
}

function getDataCheckString(authData: Record<string, any>): string {
    const dataCheck = Object.entries(authData).map(([key, value]) => {
        return `${key}=${value}`;
    });

    dataCheck.sort();
    return dataCheck.join('\n');
}

function checkValidAuthData(checkHash: string, data: Record<string, any>): boolean {
    const secretKey = crypto.createHash('sha256').update(PRIVATE_TOKEN).digest();
    const dataCheck = getDataCheckString(data);
    const hash = crypto.createHmac('sha256', secretKey).update(dataCheck).digest('hex');
    return hash === checkHash;
}

async function checkAccess(adminData: AdminData): Promise<boolean> {
    const dbResponse = await makeRequest({
        text: 'SELECT * FROM admin WHERE telegram_id=$1 AND username=$2',
        values: [adminData.id, adminData.username]
    });

    if (!dbResponse || !dbResponse.rows) {
        return false;
    }

    return dbResponse.rows.length > 0;
}

export const telegramAuth = wrap<Request, Response>(async (req, res, next) => {
    const token = req.cookies['admin_session'];

    if (!token) {
        const checkHash = req.query.hash;
        delete req.query.hash;

        if (!checkValidAuthData(checkHash, req.query)) {
            req.adminForbidden = true;
        } else {
            const adminData: AdminData = {
                id: req.query.id,
                username: req.query.username
            };

            if (!(await checkAccess(adminData))) {
                req.adminForbidden = true;
            }

            const token = jwt.sign(adminData, PRIVATE_TOKEN);

            res.cookie('admin_session', token, {maxAge: 60 * 60 * 1000});
        }
    } else {
        try {
            const adminData = jwt.verify(token, PRIVATE_TOKEN) as AdminData;
            if (!(await checkAccess(adminData))) {
                req.adminForbidden = true;
            }
        } catch (err) {
            logger.info(`Invalid token: ${err.message}`);
            req.adminForbidden = true;
        }
    }

    next();
});
