import { SqliteError } from 'better-sqlite3';
import { Data } from 'effect';

export const DATABASE_EXCEPTION_TAG = 'DatabaseException';

export class DatabaseException extends Data.TaggedError(DATABASE_EXCEPTION_TAG)<{
    name: string;
    code: string;
    message: string;
    cause?: SqliteError;
}> {
    static from(sqliteError: SqliteError): DatabaseException {
        if (sqliteError instanceof SqliteError) {
            return new DatabaseException({
                name: sqliteError.name,
                code: sqliteError.code,
                message: sqliteError.message,
                cause: sqliteError,
            });
        }

        return new DatabaseException({
            name: 'DatabaseException',
            code: 'UNKNOWN_ERROR',
            message: 'An unknown database error occurred.',
            cause: sqliteError,
        });
    }
}
