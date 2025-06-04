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

type CreatePromptDto = {
    name: string;
    prompt: string;
    categoryId: number | null;
    tags: Tag[];
}

type PromptDto = {
    id: number;
    name: string;
    prompt: string;
    categoryId: number | null;
    tagIds: number[];
    createdAt: Date;
}

type CategoryDto = {
    id: number;
    name: string;
    createdAt: Date;
}

type TagDto = {
    id: number;
    name: string;
    createdAt: Date;
}