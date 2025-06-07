import { Effect } from "effect";
import { DATABASE_EXCEPTION_TAG, DatabaseException } from "../database.exception.js";
import { ServiceException, UnexpectedException } from "../service.exception.js";

export function promptExceptionHandler<T>(effect: Effect.Effect<T, DatabaseException | ServiceException>): Effect.Effect<T, ServiceException> {
    return effect.pipe(
        Effect.catchTag(DATABASE_EXCEPTION_TAG, (error: DatabaseException) =>
            Effect.gen(function* () {
                yield* Effect.logError("Database Error", { name: error.name, code: error.code, message: error.message });

                if (error.code === "SQLITE_CONSTRAINT") return yield* Effect.fail(new ServiceException("Prompt already exists", { cause: error }));
                

                return yield* Effect.fail(new ServiceException("Database error occurred", { cause: error }));
            })
        ),
        Effect.catchAll((error: Error) => Effect.fail(new UnexpectedException(error)))
    );
}