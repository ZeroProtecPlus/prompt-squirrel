import { Console, Effect, Layer, Logger, LogLevel, pipe } from 'effect';
import { Err, Ok } from '../common/ipc.response.js';
import { categoryService } from '../services/category.service.js';
import { runWithLogger } from '../common/utils.js';

class CategoryController implements ICategoryController {
    private readonly PREFIX = '[Category]';

    getAllCategories(): Promise<IPCResponse<CategoryDto[]>> {
        return runWithLogger(
            categoryService.getAllCategories().pipe(
                Effect.tap(() => Effect.log('getAllCategories')),
                Effect.map((categories) => Ok(categories)),
                Effect.catchAll((error) => Effect.succeed(Err(error))),
            ),
            this.PREFIX
        );
    }

    addCategory(name: string): Promise<IPCResponse<CategoryDto>> {
        return runWithLogger(
            categoryService.addCategory(name).pipe(
                Effect.tap(() => Effect.log('addCategory', { name })),
                Effect.map((category) => Ok(category)),
                Effect.catchAll((error) => Effect.succeed(Err(error))),
            ), 
            this.PREFIX
        );
    }

    removeCategoryByName(name: string): Promise<IPCResponse<void>> {
        return runWithLogger(
            categoryService.removeCategoryByName(name).pipe(
                Effect.map(() => Ok()),
                Effect.catchAll((error) => Effect.succeed(Err(error))),
            ),
            this.PREFIX
        );
    }
}

export const categoryController = new CategoryController();
