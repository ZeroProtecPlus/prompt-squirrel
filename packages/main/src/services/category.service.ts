import { SqliteError } from 'better-sqlite3';
import { Effect } from 'effect';
import { categoryDatabaseExceptionHandler } from '../common/exceptions/handlers/category-database-exception.handler.js';
import { ServiceException } from '../common/exceptions/service.exception.js';
import { toCategoryDto } from '../mapper/category.mapper.js';
import { categoryRepository } from '../repository/category.repository.js';

interface ICategoryService {
    getAllCategories(): Effect.Effect<CategoryDto[], ServiceException>;
    addCategory(name: string): Effect.Effect<CategoryDto, ServiceException>;
    removeCategoryByName(name: string): Effect.Effect<void, ServiceException>;
}

class CategoryService {
    getAllCategories(): Effect.Effect<CategoryDto[], ServiceException> {
        return categoryDatabaseExceptionHandler(
            Effect.gen(function* () {
                yield* Effect.logDebug('Service: getAllCategories - start');
                const categories = yield* categoryRepository.getAllCategories();
                yield* Effect.logDebug('Service: getAllCategories - end');
                return categories.map(toCategoryDto);
            }),
        );
    }

    addCategory(name: string): Effect.Effect<CategoryDto, ServiceException> {
        return categoryDatabaseExceptionHandler(
            Effect.gen(function* () {
                yield* Effect.logDebug('Service: addCategory - start', { name });
                const category = yield* categoryRepository.addCategory({ name });
                yield* Effect.logDebug('Service: addCategory - end', { category });
                return toCategoryDto(category);
            }),
        );
    }

    removeCategoryByName(name: string): Effect.Effect<void, ServiceException> {
        return categoryDatabaseExceptionHandler(
            Effect.gen(function* () {
                yield* Effect.logDebug('Service: removeCategoryByName - start', { name });
                yield* categoryRepository.removeCategoryByName(name);
                yield* Effect.logDebug('Service: removeCategoryByName - end', { name });
            }),
        );
    }
}

export const categoryService = new CategoryService();
