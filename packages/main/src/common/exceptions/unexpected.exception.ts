import { ServiceException } from './base/service.exception.js';

export class UnexpectedException extends ServiceException {
    constructor(cause?: unknown) {
        super(
            'UNEXPECTED ERROR',
            'UNEXPECTED',
            'An unexpected error occurred in the service layer.',
            cause,
        );
    }

    static from(unknownError: unknown): UnexpectedException {
        return new UnexpectedException(unknownError);
    }
}
