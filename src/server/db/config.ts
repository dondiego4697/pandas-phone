import * as assert from 'assert';

interface IConfig {
    host: string;
    user: string;
    password: string;
    database: string;
    port: number;
}

export const config: IConfig = {
    host: process.env.PANDA_PHONE_DB_HOST!,
    user: process.env.PANDA_PHONE_DB_USER!,
    password: process.env.PANDA_PHONE_DB_PASSWORD!,
    database: process.env.PANDA_PHONE_DB_NAME!,
    port: Number(process.env.PANDA_PHONE_DB_PORT!)
};

assert(!Object.values(config).some((val) => !val), 'There is wrong database config');
