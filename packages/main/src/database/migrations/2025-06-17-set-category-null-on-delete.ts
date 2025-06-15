import { Kysely, Migration, sql } from 'kysely';
import { DB } from '../table/index.js';

export const setCategoryNullOnDelete20250617: Migration = {
    up: async (db: Kysely<DB>) => {
        await sql`CREATE TABLE prompt_tag_backup AS SELECT * FROM prompt_tag`.execute(db);

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

        await sql`
            INSERT INTO prompt_tag(prompt_id, tag_id)
            SELECT prompt_id, tag_id FROM prompt_tag_backup
        `.execute(db);
        await sql`DROP TABLE prompt_tag_backup`.execute(db);
    },

    down: async (db: Kysely<DB>) => {
        await sql`CREATE TABLE prompt_tag_backup AS SELECT * FROM prompt_tag`.execute(db);

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

        await sql`
            INSERT INTO prompt_tag(prompt_id, tag_id)
            SELECT prompt_id, tag_id FROM prompt_tag_backup
        `.execute(db);
        await sql`DROP TABLE prompt_tag_backup`.execute(db);
    },
};
