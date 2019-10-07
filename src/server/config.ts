import * as assert from 'assert';

import {env} from 'server/lib/env';

interface IConfig {
    'logger.colorize': boolean;
    'logger.level': 'info' | 'silly';
    'app.isNodeStatic': boolean;
    'app.needPort': boolean;
    'app.publicPath': string;
    'telegram.botName': string;
    'telegram.timeout': number;
    'telegram.workChatId': number;
    'cors.origin': string;
    'telegram.disableAuth': boolean;
    'db.ssl': boolean;
}

const production: IConfig = {
    'logger.colorize': false,
    'logger.level': 'info',
    'app.isNodeStatic': false,
    'app.needPort': false,
    'app.publicPath': '/public',
    'telegram.botName': 'PandaPhoneShopBot',
    'telegram.timeout': 3000,
    'telegram.workChatId': -363392954,
    'cors.origin': 'https://pandaphone.ru',
    'telegram.disableAuth': false,
    'db.ssl': true
};

const testing: IConfig = {
    ...production
};

const development: IConfig = {
    ...testing,
    'logger.colorize': true,
    'logger.level': 'silly',
    'app.isNodeStatic': true,
    'app.needPort': true,
    'telegram.botName': 'PandaPhoneShopDevBot',
    'telegram.disableAuth': true,
    'db.ssl': false
};

const stress: IConfig = {
    ...testing
};

const configs: {[key: string]: IConfig} = {production, testing, stress, development};
const config = configs[env];
assert(config, `There is no configuration for environment "${env}"`);

function getEnv(key: string): string | undefined {
    return process.env[key];
}

[
    'PANDA_PHONE_DB_HOST',
    'PANDA_PHONE_DB_USER',
    'PANDA_PHONE_DB_PASSWORD',
    'PANDA_PHONE_DB_NAME',
    'PANDA_PHONE_DB_PORT',
    'PANDA_PHONE_TELEGRAM_BOT_API_TOKEN'
].forEach((key) => assert(getEnv(key), `Environment variable "${key}" wasn't set`));

export {config};
