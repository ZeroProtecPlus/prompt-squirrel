import { Effect } from 'effect';
import { ServiceException } from '../base/service.exception.js';
import { CategoryConflictException } from '../category/category-confilict.exception.js';
import { DATABASE_EXCEPTION_TAG, DatabaseException } from '../database.exception.js';
import { UnexpectedException } from '../unexpected.exception.js';

export function categoryExceptionHandler<T>(
    effect: Effect.Effect<T, DatabaseException>,
): Effect.Effect<T, ServiceException> {
    return effect.pipe(
        Effect.catchTag(DATABASE_EXCEPTION_TAG, (error: DatabaseException) =>
            Effect.gen(function* () {

                if (error.code === 'UNIQUE_VIOLATION')
                    return yield* Effect.fail(CategoryConflictException.from(error));

                return yield* Effect.fail(UnexpectedException.from(error));
            }),
        ),
    );
}
