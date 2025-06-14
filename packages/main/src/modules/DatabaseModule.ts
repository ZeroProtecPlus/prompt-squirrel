import { sql } from 'kysely';
import { AppModule } from '../AppModule.js';
import { ModuleContext } from '../ModuleContext.js';
import { db } from '../database/db.js';
import { isDevMode } from '../utils/env.js';

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
                    name: 'example 1',
                    prompt: 'character, cute, smiling',
                    category_id: 1,
                },
                {
                    name: 'example 2',
                    prompt: 'outfit, elegant, flowing',
                    category_id: 2,
                },
                {
                    name: 'example 3',
                    prompt: 'hairstyle, wavy, long',
                    category_id: 3,
                },
                {
                    name: 'example 4',
                    prompt: 'location, beach, sunset',
                    category_id: 4,
                },
                {
                    name: 'example 5',
                    prompt: 'pose, dynamic, action',
                    category_id: 5,
                },
                {
                    name: 'example 6',
                    prompt: 'expression, happy, joyful',
                    category_id: 6,
                },
                {
                    name: 'example 7',
                    prompt: 'composition, balanced, harmonious',
                    category_id: 7,
                },
                {
                    name: 'example 8',
                    prompt: 'style, modern, sleek',
                    category_id: 8,
                },
                {
                    name: 'example 9',
                    prompt: 'scene, dramatic, intense',
                    category_id: 9,
                },
                {
                    name: 'example 10',
                    prompt: 'character, mysterious, dark',
                    category_id: 1,
                },
                {
                    name: 'example 11',
                    prompt: 'outfit, futuristic, cyberpunk',
                    category_id: 2,
                },
                {
                    name: 'example 12',
                    prompt: 'hairstyle, short, edgy',
                    category_id: 3,
                },
                {
                    name: 'example 13',
                    prompt: 'location, forest, mystical',
                    category_id: 4,
                },
                {
                    name: 'example 14',
                    prompt: 'pose, relaxed, casual',
                    category_id: 5,
                },
                {
                    name: 'example 15',
                    prompt: 'expression, surprised, shocked',
                    category_id: 6,
                },
                {
                    name: 'example 16',
                    prompt: 'composition, asymmetrical, dynamic',
                    category_id: 7,
                },
                {
                    name: 'example 17',
                    prompt: 'style, vintage, retro',
                    category_id: 8,
                },
                {
                    name: 'example 18',
                    prompt: 'scene, peaceful, serene',
                    category_id: 9,
                },
                {
                    name: 'example 19',
                    prompt: 'character, heroic, brave',
                    category_id: 1,
                },
                {
                    name: 'example 20',
                    prompt: 'outfit, casual, everyday',
                    category_id: 2,
                },
                {
                    name: 'example 21',
                    prompt: 'hairstyle, messy, tousled',
                    category_id: 3,
                },
                {
                    name: 'example 22',
                    prompt: 'location, city, urban',
                    category_id: 4,
                },
                {
                    name: 'example 23',
                    prompt: 'pose, thoughtful, contemplative',
                    category_id: 5,
                },
                {
                    name: 'example 24',
                    prompt: 'expression, sad, melancholic',
                    category_id: 6,
                },
                {
                    name: 'example 25',
                    prompt: 'composition, chaotic, cluttered',
                    category_id: 7,
                },
                {
                    name: 'example 26',
                    prompt: 'style, abstract, surreal',
                    category_id: 8,
                },
                {
                    name: 'example 27',
                    prompt: 'scene, action-packed, thrilling',
                    category_id: 9,
                },
                {
                    name: 'example 28',
                    prompt: 'character, playful, fun',
                    category_id: 1,
                },
                {
                    name: 'example 29',
                    prompt: 'outfit, sporty, athletic',
                    category_id: 2,
                },
                {
                    name: 'example 30',
                    prompt: 'hairstyle, braided, intricate',
                    category_id: 3,
                },
                {
                    name: 'example 31',
                    prompt: 'location, mountain, adventurous',
                    category_id: 4,
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
