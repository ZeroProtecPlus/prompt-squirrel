import { Kysely, Migration, sql } from 'kysely';
import { DB } from '../table/index.js';

export const setCategoryNullOnDelete20250617: Migration = {
    up: async (db: Kysely<DB>) => {
        await db.schema
            .createTable('prompt_temp')
            .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
            .addColumn('name', 'varchar(255)', (col) => col.notNull().unique())
            .addColumn('prompt', 'text', (col) => col.notNull())
            .addColumn('category_id', 'integer', (col) =>
                col.references('category.id').onDelete('set null'),
            )
            .addColumn('created_at', 'datetime', (col) =>
                col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
            )
            .addColumn('thumbnail', 'varchar(255)')
            .execute();

        await sql`INSERT INTO prompt_temp SELECT * FROM prompt`.execute(db);

        await db.schema.dropTable('prompt').execute();

        await sql`ALTER TABLE prompt_temp RENAME TO prompt`.execute(db);
    },

    down: async (db: Kysely<DB>) => {
        await db.schema
            .createTable('prompt_temp')
            .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
            .addColumn('name', 'varchar(255)', (col) => col.notNull().unique())
            .addColumn('prompt', 'text', (col) => col.notNull())
            .addColumn('category_id', 'integer', (col) =>
                col.references('category.id').onDelete('cascade'),
            )
            .addColumn('created_at', 'datetime', (col) =>
                col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
            )
            .addColumn('thumbnail', 'varchar(255)')
            .execute();

        await sql`INSERT INTO prompt_temp SELECT * FROM prompt`.execute(db);

        await db.schema.dropTable('prompt').execute();

        await sql`ALTER TABLE prompt_temp RENAME TO prompt`.execute(db);
    },
};
