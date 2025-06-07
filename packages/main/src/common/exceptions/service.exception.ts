export class ServiceException extends Error {
    static from(unknownError: unknown): ServiceException {
        if (unknownError instanceof Error) return new ServiceException(unknownError.message);

        return new ServiceException(String(unknownError));
    }
}

export class UnexpectedException extends ServiceException {
    constructor(cause?: unknown) {
        super("An unexpected error occurred in the service layer.");
        this.cause = cause;
    }
}