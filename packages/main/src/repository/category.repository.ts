import { SqliteError } from 'better-sqlite3';
import { Console, Effect, Logger } from 'effect';
import { db } from '../database/db.js';
import { InsertCategory, SelectCategory } from '../database/table/index.js';

export class CategoryRepository {
    getAllCategories(): Effect.Effect<SelectCategory[], SqliteError> {
        return Effect.promise(() => db.selectFrom('category').selectAll().execute()).pipe(
            Effect.tap((categories) =>
                Effect.log(`Repository getAllCategories Length : ${categories.length}`),
            ),
        );
    }

    addCategory(insert: InsertCategory): Effect.Effect<SelectCategory, SqliteError> {
        return Effect.promise(() =>
            db.insertInto('category').values(insert).returningAll().executeTakeFirstOrThrow(),
        ).pipe(Effect.tap((category) => Effect.log('Repository addCategory:', category)));
    }

    removeCategoryByName(name: string): Effect.Effect<void, SqliteError> {
        return Effect.promise(() =>
            db.deleteFrom('category').where('name', '=', name).execute(),
        ).pipe(Effect.tap(() => Effect.log('Repository removeCategoryByName:', name)));
    }
}
