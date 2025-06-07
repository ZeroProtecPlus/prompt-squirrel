import { SqliteError } from 'better-sqlite3';
import { Effect } from 'effect';
import { DatabaseException } from './database.exception.js';

export function handleSqliteError<T>(
    effect: Effect.Effect<T, SqliteError>,
): Effect.Effect<T, DatabaseException> {
    return effect.pipe(Effect.catchAll((error) => DatabaseException.from(error)));
}
