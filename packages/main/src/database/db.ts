import path from 'node:path';
import Database from 'better-sqlite3';
import { app } from 'electron';
import { Kysely, SqliteDialect } from 'kysely';
import { isDevMode } from '../utils/env.js';
import type { DB } from './table/index.js';

const DB_PATH = isDevMode()
    ? ':memory:'
    : path.join(app.getPath('userData'), 'data', 'prompt-squirrel.db');

export const db = new Kysely<DB>({
    dialect: new SqliteDialect({
        database: new Database(DB_PATH),
    }),
});
