import { Console, Effect, LogLevel, Logger } from 'effect';
import { isDevMode } from '../utils/env.js';
import { logger } from './logger.js';
import { Err } from './ipc.response.js';
import { UnexpectedException } from './exceptions/unexpected.exception.js';

const combined = Logger.zip(Logger.prettyLoggerDefault, logger);
const logLayer = Logger.replace(Logger.defaultLogger, combined);

export function runWithLogger<T>(effect: Effect.Effect<T, unknown>, label?: string): Promise<T> {
    return Effect.runPromise(
        effect.pipe(
            Effect.catchAll((error) => {
                return Effect.gen(function* () {
                    if (error instanceof UnexpectedException) {
                        yield* Effect.logError('An error occurred:', {
                            name: error.name,
                            message: error.message,
                            stack: error.stack,
                            cause: error.cause,
                        });
                    }
                    return yield* Effect.fail(Err(error));
                });
            }),
            Console.withGroup({ label: label ?? '[Logger]' }),
            Effect.provide(logLayer),
            Logger.withMinimumLogLevel(isDevMode() ? LogLevel.Debug : LogLevel.Info),
        ),
    );
}
