import { Effect } from 'effect';
import { db } from '../database/db.js';
import { InsertCategory, SelectCategory } from '../database/table/index.js';

export class CategoryRepository {
    getAllCategories(): Effect.Effect<SelectCategory[]> {
        return Effect.promise(() => db.selectFrom('category').selectAll().execute());
    }

    addCategory(insert: InsertCategory): Effect.Effect<SelectCategory> {
        return Effect.promise(() => {
            return db
                .insertInto('category')
                .values(insert)
                .returningAll()
                .executeTakeFirstOrThrow();
        });
    }

    removeCategoryByName(name: string): Effect.Effect<void> {
        return Effect.promise(() => {
            return db.deleteFrom('category').where('name', '=', name).execute();
        });
    }
}
