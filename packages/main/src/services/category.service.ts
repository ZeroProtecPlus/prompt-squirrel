import { Effect } from 'effect';
import { ServiceException } from '../common/exceptions/base/service.exception.js';
import { categoryExceptionHandler } from '../common/exceptions/handlers/category-exception.handler.js';
import { toCategoryDto } from '../mapper/category.mapper.js';
import { categoryRepository } from '../repository/category.repository.js';

interface ICategoryService {
    getAllCategories(): Effect.Effect<CategoryDto[], ServiceException>;
    addCategory(name: string): Effect.Effect<CategoryDto, ServiceException>;
    removeCategoryByName(name: string): Effect.Effect<void, ServiceException>;
}

class CategoryService implements ICategoryService {
    getAllCategories() {
        return categoryExceptionHandler(
            Effect.gen(function* () {
                yield* Effect.logDebug('Service: getAllCategories - start');
                const categories = yield* categoryRepository.getAllCategories();
                yield* Effect.logDebug('Service: getAllCategories - end');
                return categories.map(toCategoryDto);
            }),
        );
    }

    addCategory(name: string): Effect.Effect<CategoryDto, ServiceException> {
        return categoryExceptionHandler(
            Effect.gen(function* () {
                yield* Effect.logDebug('Service: addCategory - start', { name });
                const category = yield* categoryRepository.addCategory({ name });
                yield* Effect.logDebug('Service: addCategory - end', { category });
                return toCategoryDto(category);
            }),
        );
    }

    addCategoryIfNotExists(name: string): Effect.Effect<CategoryDto, ServiceException> {
        return categoryExceptionHandler(
            Effect.gen(function* () {
                yield* Effect.logDebug('Service: addCategoryIfNotExists - start', { name });
                const existingCategory = yield* categoryRepository.findByName(name);
                if (existingCategory) {
                    yield* Effect.logDebug('Service: addCategoryIfNotExists - end (exists)', {
                        name,
                    });
                    return toCategoryDto(existingCategory);
                }
                const newCategory = yield* categoryRepository.addCategory({ name });
                yield* Effect.logDebug('Service: addCategoryIfNotExists - end (new)', {
                    newCategory,
                });
                return toCategoryDto(newCategory);
            }),
        );
    }

    removeCategoryByName(name: string): Effect.Effect<void, ServiceException> {
        return categoryExceptionHandler(
            Effect.gen(function* () {
                yield* Effect.logDebug('Service: removeCategoryByName - start', { name });
                yield* categoryRepository.removeCategoryByName(name);
                yield* Effect.logDebug('Service: removeCategoryByName - end', { name });
            }),
        );
    }
}

export const categoryService = new CategoryService();
