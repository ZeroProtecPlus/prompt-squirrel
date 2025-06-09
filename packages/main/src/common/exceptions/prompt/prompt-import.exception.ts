import { ServiceException } from '../base/service.exception.js';

export class PromptImportException extends ServiceException {
    constructor(cause: unknown) {
        super(
            'PROMPT IMPORT ERROR',
            'UNEXPECTED',
            'An error occurred while importing prompts.',
            cause,
        );
    }

    static from(cause: unknown): PromptImportException {
        return new PromptImportException(cause);
    }
}
