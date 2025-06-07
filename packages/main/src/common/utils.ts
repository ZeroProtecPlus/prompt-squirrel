import { Console, Effect, Logger, LogLevel } from 'effect';
import { logger } from './logger.js';
import { isDevMode } from '../utils/env.js';
import { ServiceException } from './exceptions/service.exception.js';

const combined = Logger.zip(Logger.prettyLoggerDefault, logger);
const logLayer = Logger.replace(Logger.defaultLogger, combined);

export function runWithLogger<T>(effect: Effect.Effect<T, unknown>, label?: string): Promise<T> {
    return Effect.runPromise(
        effect.pipe(
            Console.withGroup({ label: label ?? '[Logger]' }),
            Effect.provide(logLayer),
            Logger.withMinimumLogLevel(isDevMode() ? LogLevel.Debug : LogLevel.Info),
            Effect.catchAll((error) => Effect.fail(ServiceException.from(error)))
        ),
    );
}
