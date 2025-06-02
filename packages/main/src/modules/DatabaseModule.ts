import { sql } from 'kysely';
import { AppModule } from 'src/AppModule.js';
import { ModuleContext } from 'src/ModuleContext.js';
import { db } from '../database/db.js';

class DatabaseModule implements AppModule {
    async enable(context: ModuleContext): Promise<void> {
        console.log('DatabaseModule enabled');
        await this.table();
        await this.seed();
        console.log('DatabaseModule Successfully initialized');
    }

    async table(): Promise<void> {
        await db.schema
            .createTable('category')
            .ifNotExists()
            .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
            .addColumn('name', 'varchar(255)', (col) => col.unique().notNull())
            .addColumn('created_at', 'datetime', (col) =>
                col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
            )
            .execute();
    }

    async seed(): Promise<void> {
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
    }
}

export function databaseModule(): DatabaseModule {
    return new DatabaseModule();
}
