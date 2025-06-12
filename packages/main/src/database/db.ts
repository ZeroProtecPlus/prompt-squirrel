import path from 'node:path';
import Database from 'better-sqlite3';
import { app } from 'electron';
import { Kysely, SqliteDialect } from 'kysely';
import type { DB } from './table/index.js';
import fs from 'node:fs';

const DB_PATH = app.isPackaged
    ? path.join(app.getPath('userData'), 'data', 'prompt-squirrel.db')
    : ':memory:';

if (app.isPackaged) {
    const dir = path.dirname(DB_PATH);
    try {
        if (!fs.existsSync(dir)) 
            fs.mkdirSync(dir, { recursive: true });
    } catch (error) {
        console.error('Failed to create database directory:', error);
    }
}

export const db = new Kysely<DB>({
    dialect: new SqliteDialect({
        database: new Database(DB_PATH),
    }),
});
