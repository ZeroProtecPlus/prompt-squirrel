import { Logger, LogLevel } from "effect";
import log from 'electron-log';
import { inspect } from "node:util";

log.initialize();

log.transports.console.level = 'error';
log.transports.file.level = 'error';
log.transports.file.fileName = 'error.log';

export const logger = Logger.make(({ logLevel, message }) => {
    const logMessage = inspect(message, false, null, true);
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
})