export class ServiceException extends Error {
    static from(unknownError: unknown): ServiceException {
        if (unknownError instanceof Error) return new ServiceException(unknownError.message);

        return new ServiceException(String(unknownError));
    }
}
