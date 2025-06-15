import { Migration, MigrationProvider } from 'kysely';
import { init20250615 } from './migrations/2025-06-15-init.js';
import { thumbnail20250616 } from './migrations/2025-06-16-thumbnail.js';
import { setCategoryNullOnDelete20250617 } from './migrations/2025-06-17-set-category-null-on-delete.js';

export class AppMigrationProvider implements MigrationProvider {
    getMigrations(): Promise<Record<string, Migration>> {
        return Promise.resolve({
            '2025-06-15-init': init20250615,
            '2025-06-16-thumbnail': thumbnail20250616,
            '2025-06-17-set-category-null-on-delete': setCategoryNullOnDelete20250617,
        });
    }
}
