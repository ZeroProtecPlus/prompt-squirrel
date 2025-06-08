import { sql } from 'kysely';
import { AppModule } from 'src/AppModule.js';
import { ModuleContext } from 'src/ModuleContext.js';
import { db } from '../database/db.js';
import { isDevMode } from 'src/utils/env.js';

class DatabaseModule implements AppModule {
    async enable(context: ModuleContext): Promise<void> {
        console.log('DatabaseModule enabled');
        await this.table();
        await this.seed();
        console.log('DatabaseModule Successfully initialized');
    }

    async table(): Promise<void> {
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
    }

    async seed(): Promise<void> {
        if (!isDevMode()) return;

        await db
            .insertInto('category')
            .values([
                { name: '캐릭터' },
                { name: '의상' },
                { name: '헤어스타일' },
                { name: '장소' },
                { name: '자세' },
                { name: '표정' },
                { name: '구도' },
                { name: '스타일' },
                { name: '장면' },
            ])
            .execute();

        await db
            .insertInto('tag')
            .values([{ name: '태그1' }, { name: '태그2' }, { name: '태그3' }])
            .execute();

        await db
            .insertInto('prompt')
            .values([
                {
                    name: '예시 프롬프트 1',
                    prompt: '귀여운 캐릭터, 아름다운 의상, 헤어스타일, 장소, 자세, 표정, 구도, 스타일, 장면',
                    category_id: 1,
                },
                {
                    name: '예시 프롬프트 2',
                    prompt: '아름다운 의상',
                    category_id: 2,
                },
            ])
            .execute();

        await db
            .insertInto('prompt_tag')
            .values([
                { prompt_id: 1, tag_id: 1 },
                { prompt_id: 1, tag_id: 2 },
                { prompt_id: 2, tag_id: 3 },
            ])
            .execute();
    }
}

export function databaseModule(): DatabaseModule {
    return new DatabaseModule();
}
