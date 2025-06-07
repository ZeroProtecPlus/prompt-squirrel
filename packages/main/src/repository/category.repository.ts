import { Effect, Logger } from 'effect';
import { DatabaseException } from '../common/exceptions/database.exception.js';
import { handleSqliteError } from '../common/exceptions/sqlite-error.handler.js';
import { db } from '../database/db.js';
import { InsertCategory, SelectCategory } from '../database/table/index.js';

interface ICategoryRepository {
    getAllCategories(): Effect.Effect<SelectCategory[], DatabaseException>;
    addCategory(insert: InsertCategory): Effect.Effect<SelectCategory, DatabaseException>;
    removeCategoryByName(name: string): Effect.Effect<void, DatabaseException>;
}

class CategoryRepository implements ICategoryRepository {
    getAllCategories() {
        return handleSqliteError(
            Effect.gen(function* () {
                yield* Effect.logDebug('Repository getAllCategories - start');
                const categories = yield* Effect.promise(() =>
                    db.selectFrom('category').selectAll().execute(),
                );
                yield* Effect.logDebug('Repository getAllCategories - end');
                return categories;
            }),
        );
    }

    addCategory(insert: InsertCategory) {
        return handleSqliteError(
            Effect.gen(function* () {
                yield* Effect.logDebug('Repository addCategory - start');
                const category = yield* Effect.promise(() =>
                    db
                        .insertInto('category')
                        .values(insert)
                        .returningAll()
                        .executeTakeFirstOrThrow(),
                );
                yield* Effect.logDebug('Repository addCategory - end');
                return category;
            }),
        );
    }

    removeCategoryByName(name: string) {
        return handleSqliteError(
            Effect.gen(function* () {
                yield* Effect.logDebug('Repository removeCategoryByName - start');
                yield* Effect.promise(() =>
                    db.deleteFrom('category').where('name', '=', name).execute(),
                );
                yield* Effect.logDebug('Repository removeCategoryByName - end');
            }),
        );
    }
}

export const categoryRepository = new CategoryRepository();
