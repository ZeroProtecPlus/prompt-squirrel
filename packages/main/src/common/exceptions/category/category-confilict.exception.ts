import { ServiceException } from '../base/service.exception.js';

export class CategoryConflictException extends ServiceException {
    constructor(cause?: unknown) {
        super('CATEGORY CONFLICT', 'CONFLICT', 'A category with this name already exists.', cause);
    }

    static from(unknownError: unknown): CategoryConflictException {
        return new CategoryConflictException(unknownError);
    }
}
