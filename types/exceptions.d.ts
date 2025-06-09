type ExceptionCode = 'NOT_FOUND' | 'UNEXPECTED' | 'CONFLICT';

type ServiceException = {
    name: string;
    code: ExceptionCode;
    message: string;
    cause?: unknown;
}

type ServiceExceptionHandler = (error: ServiceException) => void;