import { Effect } from 'effect';
import { ServiceException } from '../base/service.exception.js';
import { DATABASE_EXCEPTION_TAG, DatabaseException } from '../database.exception.js';
import { PromptConflictException } from '../prompt/prompt-confilct.exception.js';
import { UnexpectedException } from '../unexpected.exception.js';

export function promptExceptionHandler<T>(
    effect: Effect.Effect<T, DatabaseException | ServiceException>,
): Effect.Effect<T, ServiceException> {
    return effect.pipe(
        Effect.catchTag(DATABASE_EXCEPTION_TAG, (error: DatabaseException) =>
            Effect.gen(function* () {

                if (error.code === 'SQLITE_CONSTRAINT_UNIQUE')
                    return yield* Effect.fail(PromptConflictException.from(error));

                return yield* Effect.fail(UnexpectedException.from(error));
            }),
        ),
    );
}
