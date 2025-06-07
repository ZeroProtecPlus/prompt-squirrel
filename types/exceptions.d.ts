type ExceptionCode = 'NOT_FOUND' | 'UNEXPECTED' | 'CONFLICT';

type ServiceException = {
    name: string;
    code: ExceptionCode;
    message: string;
}

type ServiceExceptionHandler = (error: ServiceException) => void;