import * as pg from 'pg';
import * as Boom from '@hapi/boom';

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
        throw Boom.badRequest(err.message);
    } finally {
        if (client) {
            client.release();
        }
    }

    return result;
}

export async function makeTransactionRequest(client: pg.PoolClient, query: pg.QueryConfig) {
    try {
        return await client.query(query);
    } catch (err) {
        logger.error(`Database query error: ${err.message}, ${JSON.stringify(query)}`);
        throw Boom.badRequest(err.message);
    }
}

export async function getPgClient(): Promise<pg.PoolClient> {
    try {
        return await pool.connect();
    } catch (err) {
        logger.error(`Database get client error: ${err.message}`);
        throw Boom.badRequest(err.message);
    }
}

export const forceCloseConnection = () => pool.end();
