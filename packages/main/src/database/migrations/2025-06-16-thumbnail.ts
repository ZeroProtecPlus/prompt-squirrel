import { Kysely, Migration } from 'kysely';
import { DB } from '../table/index.js';

export const thumbnail20250616: Migration = {
    up: async (db: Kysely<DB>) => {
        await db.schema.alterTable('prompt').addColumn('thumbnail', 'varchar(255)').execute();
    },

    down: async (db: Kysely<DB>) => {
        await db.schema.alterTable('prompt').dropColumn('thumbnail').execute();
    },
};
