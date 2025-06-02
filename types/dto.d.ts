type IPCSuccess<T> = {
    success: true;
    data: T;
    error: undefined;
}

type IPCError = {
    success: false;
    data: undefined;
    error: Error;
}

type IPCResponse<T> = IPCSuccess<T> | IPCError;

type CategoryDto = {
    id: number;
    name: string;
    createdAt: Date;
}