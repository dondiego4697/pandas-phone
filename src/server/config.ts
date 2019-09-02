import * as assert from 'assert';

import {env} from 'server/lib/env';

interface Config {
    'logger.colorize': boolean;
    'logger.level': 'info' | 'silly';
    'app.isNodeStatic': boolean;
    'app.needPort': boolean;
    'app.publicPath': string;
}

const production: Config = {
    'logger.colorize': false,
    'logger.level': 'info',
    'app.isNodeStatic': false,
    'app.needPort': false,
    'app.publicPath': '/public'
};

const testing: Config = {
    ...production
};

const development: Config = {
    ...testing,
    'logger.colorize': true,
    'logger.level': 'silly',
    'app.isNodeStatic': true,
    'app.needPort': true
};

const stress: Config = {
    ...testing
};

const configs: {[key: string]: Config} = {production, testing, stress, development};
const config = configs[env];
assert(config, `There is no configuration for environment "${env}"`);

export {config};
