import { SqliteError } from 'better-sqlite3';
import { Effect } from 'effect';
import { ServiceException } from '../common/exceptions/service.exception.js';
import { toCategoryDto } from '../mapper/category.mapper.js';
import { CategoryRepository } from '../repository/category.repository.js';

class CategoryService {
    private categoryRepository: CategoryRepository;

    constructor() {
        this.categoryRepository = new CategoryRepository();
    }

    getAllCategories(): Effect.Effect<CategoryDto[], ServiceException> {
        return this.categoryRepository.getAllCategories().pipe(
            Effect.tap(() => Effect.log('Service: getAllCategories')),
            Effect.map((categories) => categories.map(toCategoryDto)),
            Effect.map((categories) => categories.toSorted((a, b) => a.name.localeCompare(b.name))),
            Effect.catchAll((error) => Effect.fail(ServiceException.from(error))),
        );
    }

    addCategory(name: string): Effect.Effect<CategoryDto, ServiceException> {
        return this.categoryRepository.addCategory({ name }).pipe(
            Effect.tap(() => Effect.log('Service: addCategory', { name })),
            Effect.map(toCategoryDto),
            Effect.catchAll((error: SqliteError) => {
                if (error instanceof SqliteError && error.code === 'SQLITE_CONSTRAINT')
                    return Effect.fail(new ServiceException('Category already exists', error));
                return Effect.fail(ServiceException.from(error));
            }),
        );
    }

    removeCategoryByName(name: string): Effect.Effect<void, ServiceException> {
        return this.categoryRepository.removeCategoryByName(name).pipe(
            Effect.tap(() => Effect.log('Service: removeCategoryByName', { name })),
            Effect.catchAll((error) => Effect.fail(ServiceException.from(error))),
        );
    }
}

export const categoryService = new CategoryService();
