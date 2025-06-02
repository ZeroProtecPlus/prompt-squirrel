export function Ok<T = undefined>(data?: T): IPCResponse<T> {
    return {
        success: true as const,
        data: data as T,
        error: undefined,
    };
}

export function Err(error: unknown): IPCError {
    return {
        success: false as const,
        error: error as Error,
        data: undefined,
    };
}
