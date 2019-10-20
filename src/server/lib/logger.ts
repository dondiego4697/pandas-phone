import * as winston from 'winston';

import {config} from 'server/config';

const format = winston.format.printf(({level, message}) => `[${level}] [${new Date().toISOString()}] ${message}`);

export const logger = winston.createLogger(!process.env.DISABLE_LOGGING ? {
    transports: [
        new winston.transports.Console({
            level: config['logger.level'],
            format: config['logger.colorize'] ?
                winston.format.combine(winston.format.colorize(), format) :
                winston.format.combine(format)
        })
    ]
} : {});
