import { Kysely, Migration, sql } from 'kysely';
import { DB } from '../table/index.js';

export const init20250615: Migration = {
    up: async (db: Kysely<DB>) => {
        // Category
        await db.schema
            .createTable('category')
            .ifNotExists()
            .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
            .addColumn('name', 'varchar(255)', (col) => col.notNull().unique())
            .addColumn('created_at', 'datetime', (col) =>
                col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
            )
            .execute();

        // Tag
        await db.schema
            .createTable('tag')
            .ifNotExists()
            .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
            .addColumn('name', 'varchar(255)', (col) => col.notNull().unique())
            .addColumn('created_at', 'datetime', (col) =>
                col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
            )
            .execute();

        // Prompt
        await db.schema
            .createTable('prompt')
            .ifNotExists()
            .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
            .addColumn('name', 'varchar(255)', (col) => col.notNull().unique())
            .addColumn('prompt', 'text', (col) => col.notNull())
            .addColumn('category_id', 'integer', (col) =>
                col.references('category.id').onDelete('cascade'),
            )
            .addColumn('created_at', 'datetime', (col) =>
                col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
            )
            .execute();

        // PromptTag
        await db.schema
            .createTable('prompt_tag')
            .ifNotExists()
            .addColumn('prompt_id', 'integer', (col) =>
                col.notNull().references('prompt.id').onDelete('cascade'),
            )
            .addColumn('tag_id', 'integer', (col) =>
                col.notNull().references('tag.id').onDelete('cascade'),
            )
            .addPrimaryKeyConstraint('pk_prompt_tag', ['prompt_id', 'tag_id'])
            .execute();
    },

    down: async (db: Kysely<DB>) => {
        await db.schema.dropTable('prompt_tag').ifExists().execute();
        await db.schema.dropTable('prompt').ifExists().execute();
        await db.schema.dropTable('tag').ifExists().execute();
        await db.schema.dropTable('category').ifExists().execute();
    },
};
