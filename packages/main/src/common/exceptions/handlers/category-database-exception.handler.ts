import { Effect } from 'effect';
import { DATABASE_EXCEPTION_TAG, DatabaseException } from '../database.exception.js';
import { ServiceException, UnexpectedException } from '../service.exception.js';

export function categoryDatabaseExceptionHandler<T>(
    effect: Effect.Effect<T, DatabaseException>,
): Effect.Effect<T, ServiceException> {
    return effect.pipe(
        Effect.catchTag(DATABASE_EXCEPTION_TAG, (error: DatabaseException) =>
            Effect.gen(function* () {
                yield* Effect.logError('Database Error', {
                    name: error.name,
                    code: error.code,
                    message: error.message,
                });

                if (error.code === 'SQLITE_CONSTRAINT')
                    return yield* Effect.fail(
                        new ServiceException('Category already exists', { cause: error }),
                    );

                return yield* Effect.fail(
                    new ServiceException('Database error occurred', { cause: error }),
                );
            }),
        ),
        Effect.catchAll((error: Error) => Effect.fail(new UnexpectedException(error))),
    );
}
