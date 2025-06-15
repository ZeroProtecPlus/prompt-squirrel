import { inspect } from 'node:util';
import { LogLevel, Logger } from 'effect';
import log from 'electron-log';

log.initialize();

log.transports.console.level = false;
log.transports.file.level = 'error';
log.transports.file.fileName = 'error.log';

export const logger = Logger.make(({ logLevel, message }) => {
    const logMessage = inspect(message, false, null, false);
    switch (logLevel) {
        case LogLevel.Debug:
            log.debug(logMessage);
            break;
        case LogLevel.Info:
            log.info(logMessage);
            break;
        case LogLevel.Warning:
            log.warn(logMessage);
            break;
        case LogLevel.Error:
            log.error(logMessage);
            break;
        case LogLevel.None:
            log.silly(logMessage);
            break;
        default:
            log.info(logMessage);
            break;
    }
});

export const MainLogger = log;
