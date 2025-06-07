import { Console, Effect, LogLevel, Logger } from 'effect';
import { isDevMode } from '../utils/env.js';
import { ServiceException } from './exceptions/base/service.exception.js';
import { UnexpectedException } from './exceptions/unexpected.exception.js';
import { Err } from './ipc.response.js';
import { logger } from './logger.js';

const combined = Logger.zip(Logger.prettyLoggerDefault, logger);
const logLayer = Logger.replace(Logger.defaultLogger, combined);

export function runWithLogger<T>(
    effect: Effect.Effect<T, unknown>,
    label?: string,
): Promise<T | IPCError> {
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

                    if (error instanceof ServiceException) {
                        return yield* Effect.succeed(
                            Err({
                                name: error.name,
                                code: error.code,
                                message: error.message,
                            }),
                        );
                    }

                    return yield* Effect.succeed(Err(error));
                });
            }),
            Console.withGroup({ label: label ?? '[Logger]' }),
            Effect.provide(logLayer),
            Logger.withMinimumLogLevel(isDevMode() ? LogLevel.Debug : LogLevel.Info),
        ),
    );
}
