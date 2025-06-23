import { Migrator } from 'kysely';
import { AppModule } from '../AppModule.js';
import { ModuleContext } from '../ModuleContext.js';
import { MainLogger } from '../common/logger.js';
import { db } from '../database/db.js';
import { AppMigrationProvider } from '../database/migration.provider.js';
import { isDevMode } from '../utils/env.js';

class DatabaseModule implements AppModule {
    async enable({ app }: ModuleContext): Promise<void> {
        await app.whenReady();
        console.log('DatabaseModule enabled');
        await this.migrate();
        await this.seed();
        console.log('DatabaseModule Successfully initialized');
    }

    async migrate(): Promise<void> {
        const migrator = new Migrator({
            db,
            provider: new AppMigrationProvider(),
        });

        const { error, results } = await migrator.migrateToLatest();

        if (results) {
            for (const result of results) {
                if (result.status === 'Success') {
                    console.log(`migration "${result.migrationName}" was executed successfully`);
                } else if (result.status === 'Error') {
                    MainLogger.error(`failed to execute migration "${result.migrationName}"`);
                }
            }
        }

        if (error) {
            MainLogger.error('failed to migrate');
            MainLogger.error(error);
            db.destroy();
            process.exit(1);
        }
    }

    async seed(): Promise<void> {
        if (!isDevMode()) return;

        await db
            .insertInto('category')
            .values([
                { name: 'Personaje' },
                { name: 'Vestimenta' },
                { name: 'Peinado' },
                { name: 'Lugar' },
                { name: 'Pose' },
                { name: 'Expresión' },
                { name: 'Composición' },
                { name: 'Estilo' },
                { name: 'Escena' },
            ])
            .execute();

        await db
            .insertInto('tag')
            .values([{ name: 'Etiqueta1' }, { name: 'Etiqueta2' }, { name: 'Etiqueta3' }])
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
