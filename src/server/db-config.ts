import * as assert from 'assert';

import {env} from 'server/lib/env';

interface Config {
    host: string;
    user: string;
    password: string;
    database: string;
    port: number;
}

const production: Config = {
    host: '',//process.env.PANDA_PHONE_DB_HOST,
    user: '',
    password: '',
    database: '',
    port: 6543
};

const testing: Config = {
    ...production
};

const development: Config = {
    ...testing
};

const stress: Config = {
    ...testing
};

const configs: {[key: string]: Config} = {production, testing, stress, development};
const config = configs[env];
assert(config, `There is no configuration for environment "${env}"`);

export {config};
