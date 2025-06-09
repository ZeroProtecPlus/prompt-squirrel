import { ServiceException } from '../base/service.exception.js';

export class PromptExportException extends ServiceException {
    constructor(cause?: unknown) {
        super(
            'PROMPT EXPORT ERROR',
            'UNEXPECTED',
            'An error occurred while exporting prompts.',
            cause,
        );
    }

    static from(cause: unknown): PromptExportException {
        return new PromptExportException(cause);
    }
}
