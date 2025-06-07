export class ServiceException extends Error {
    constructor(
        public readonly name: string,
        public readonly code: ExceptionCode,
        public readonly message: string,
        public readonly cause?: unknown,
    ) {
        super(message, { cause });
    }
}
