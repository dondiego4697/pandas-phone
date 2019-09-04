import * as pg from 'pg';
import {logger} from 'server/lib/logger';

import {config as dbConfig} from 'server/db/config';

const {Pool} = pg;

const config = {
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    port: dbConfig.port,
    idleTimeoutMillis: 1000 * 60 * 2,
    connectionTimeoutMillis: 2000
};

const pool = new Pool(config);
pool.on('error', (err) => logger.error(`Connection database error: ${err}`));

export async function makeRequest(query: pg.QueryConfig) {
    let client;
    let result;

    try {
        client = await pool.connect();
        result = await client.query(query);
    } catch (err) {
        logger.error(`Database query error: ${err.message}, ${JSON.stringify(query)}`);
    } finally {
        if (client) {
            client.release();
        }
    }

    return result;
}

export const forceCloseConnection = () => pool.end();
