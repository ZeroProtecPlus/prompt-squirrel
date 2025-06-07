import { ServiceException } from '../base/service.exception.js';

export class PromptConflictException extends ServiceException {
    constructor(cause?: unknown) {
        super('PROMPT CONFLICT', 'CONFLICT', 'A prompt with this name already exists.', cause);
    }

    static from(unknownError: unknown): PromptConflictException {
        return new PromptConflictException(unknownError);
    }
}
