import { Effect } from 'effect';
import { DatabaseException } from '../common/exceptions/database.exception.js';
import { db } from '../database/db.js';
import { InsertCategory, SelectCategory } from '../database/table/index.js';

interface ICategoryRepository {
    getAllCategories(): Effect.Effect<SelectCategory[], DatabaseException>;
    addCategory(insert: InsertCategory): Effect.Effect<SelectCategory, DatabaseException>;
    removeCategoryByName(name: string): Effect.Effect<void, DatabaseException>;
}

class CategoryRepository implements ICategoryRepository {
    getAllCategories() {
        return Effect.gen(function* () {
            yield* Effect.logDebug('Repository getAllCategories - start');
            const categories = yield* Effect.tryPromise({
                try: () => db.selectFrom('category').selectAll().orderBy('name', 'asc').execute(),
                catch: (error) => DatabaseException.from(error),
            });
            yield* Effect.logDebug('Repository getAllCategories - end');
            return categories;
        });
    }

    addCategory(insert: InsertCategory) {
        return Effect.gen(function* () {
            yield* Effect.logDebug('Repository addCategory - start');
            const category = yield* Effect.tryPromise({
                try: () =>
                    db
                        .insertInto('category')
                        .values(insert)
                        .returningAll()
                        .executeTakeFirstOrThrow(),
                catch: (error) => DatabaseException.from(error),
            });
            yield* Effect.logDebug('Repository addCategory - end');
            return category;
        });
    }

    removeCategoryByName(name: string) {
        return Effect.gen(function* () {
            yield* Effect.logDebug('Repository removeCategoryByName - start');
            yield* Effect.tryPromise({
                try: () => db.deleteFrom('category').where('name', '=', name).execute(),
                catch: (error) => DatabaseException.from(error),
            });
            yield* Effect.logDebug('Repository removeCategoryByName - end');
        });
    }
}

export const categoryRepository = new CategoryRepository();
