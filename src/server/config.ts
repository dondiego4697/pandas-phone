import * as assert from 'assert';

import {env} from 'server/lib/env';

interface IConfig {
    'logger.colorize': boolean;
    'logger.level': 'info' | 'silly';
    'app.isNodeStatic': boolean;
    'app.needPort': boolean;
    'app.publicPath': string;
    'telegram.botName': string;
}

const production: IConfig = {
    'logger.colorize': false,
    'logger.level': 'info',
    'app.isNodeStatic': false,
    'app.needPort': false,
    'app.publicPath': '/public',
    'telegram.botName': 'PandaPhoneShopBot'
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
    'telegram.botName': 'PandaPhoneShopDevBot'
};

const stress: IConfig = {
    ...testing
};

const configs: {[key: string]: IConfig} = {production, testing, stress, development};
const config = configs[env];
assert(config, `There is no configuration for environment "${env}"`);

export {config};
