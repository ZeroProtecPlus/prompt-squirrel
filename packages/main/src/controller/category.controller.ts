import { Effect } from 'effect';
import { Err, Ok } from '../common/ipc.response.js';
import { categoryService } from '../services/category.service.js';

class CategoryController implements ICategoryController {
    getAllCategories(): Promise<IPCResponse<CategoryDto[]>> {
        return Effect.runPromise(
            categoryService.getAllCategories().pipe(
                Effect.map((categories) => Ok(categories)),
                Effect.catchAll((error) => Effect.succeed(Err(error))),
            ),
        );
    }

    addCategory(name: string): Promise<IPCResponse<CategoryDto>> {
        return Effect.runPromise(
            categoryService.addCategory(name).pipe(
                Effect.map((category) => Ok(category)),
                Effect.catchAll((error) => Effect.succeed(Err(error))),
            ),
        );
    }

    removeCategoryByName(name: string): Promise<IPCResponse<void>> {
        return Effect.runPromise(
            categoryService.removeCategoryByName(name).pipe(
                Effect.map(() => Ok()),
                Effect.catchAll((error) => Effect.succeed(Err(error))),
            ),
        );
    }
}

export const categoryController = new CategoryController();
