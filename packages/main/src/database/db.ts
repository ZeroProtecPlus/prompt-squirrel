import Database from 'better-sqlite3';
import { Kysely, SqliteDialect } from 'kysely';
import type { DB } from './table/index.js';

export const db = new Kysely<DB>({
    dialect: new SqliteDialect({
        database: new Database(':memory:'),
    }),
});
