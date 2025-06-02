import { Effect } from 'effect';
import { ServiceException } from '../common/exceptions/service.exception.js';
import { SelectCategory } from '../database/table/category.js';
import { toCategoryDto } from '../mapper/category.mapper.js';
import { CategoryRepository } from '../repository/category.repository.js';

class CategoryService {
    private categoryRepository: CategoryRepository;

    constructor() {
        this.categoryRepository = new CategoryRepository();
    }

    getAllCategories(): Effect.Effect<CategoryDto[], ServiceException> {
        return this.categoryRepository.getAllCategories().pipe(
            Effect.map((categories) => categories.map(toCategoryDto)),
            Effect.map((categories) => categories.toSorted((a, b) => a.name.localeCompare(b.name))),
            Effect.catchAll((error) => Effect.fail(ServiceException.from(error))),
        );
    }

    addCategory(name: string): Effect.Effect<CategoryDto, ServiceException> {
        return this.categoryRepository.addCategory({ name }).pipe(
            Effect.map(toCategoryDto),
            Effect.catchAll((error) => Effect.fail(ServiceException.from(error))),
        );
    }

    removeCategoryByName(name: string): Effect.Effect<void, ServiceException> {
        return this.categoryRepository
            .removeCategoryByName(name)
            .pipe(Effect.catchAll((error) => Effect.fail(ServiceException.from(error))));
    }
}

export const categoryService = new CategoryService();
