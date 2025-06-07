import { Console, Effect, Layer, LogLevel, Logger, pipe } from 'effect';
import { Err, Ok } from '../common/ipc.response.js';
import { runWithLogger } from '../common/utils.js';
import { categoryService } from '../services/category.service.js';

class CategoryController implements ICategoryController {
    private readonly PREFIX = '[Category]';

    getAllCategories(): Promise<IPCResponse<CategoryDto[]>> {
        return runWithLogger(
            Effect.gen(function* () {
                yield* Effect.logDebug('getAllCategories - start');
                const categories = yield* categoryService.getAllCategories();
                yield* Effect.logDebug('getAllCategories - end', { length: categories.length });
                return Ok(categories);
            }),
            this.PREFIX,
        )
    }

    addCategory(name: string): Promise<IPCResponse<CategoryDto>> {
        return runWithLogger(
            Effect.gen(function* () {
                yield* Effect.logDebug('addCategory - start', { name });
                const category = yield* categoryService.addCategory(name);
                yield* Effect.logDebug('addCategory - end', { category });
                return Ok(category);
            }),
            this.PREFIX,
        );
    }

    removeCategoryByName(name: string): Promise<IPCResponse<void>> {
        return runWithLogger(
            Effect.gen(function* () {
                yield* Effect.logDebug('removeCategoryByName - start', { name });
                yield* categoryService.removeCategoryByName(name);
                yield* Effect.logDebug('removeCategoryByName - end');
                return Ok();
            }),
            this.PREFIX,
        );
    }
}

export const categoryController = new CategoryController();
