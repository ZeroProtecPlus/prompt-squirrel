import { ServiceException } from '../base/service.exception.js';

export class TagConflictException extends ServiceException {
    constructor(cause?: unknown) {
        super('TAG CONFLICT', 'CONFLICT', 'A tag with this name already exists.', cause);
    }

    static from(unknownError: unknown): TagConflictException {
        return new TagConflictException(unknownError);
    }
}
