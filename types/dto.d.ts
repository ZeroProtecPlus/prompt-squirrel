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

type UpdatePromptDto = {
    id: number;
    name?: string;
    prompt?: string;
    categoryId?: number | null;
}

type AddTagToPromptDto = {
    promptId: number;
    tagId: number;
}

type RemoveTagFromPromptDto = AddTagToPromptDto;

type PromptDto = {
    id: number;
    name: string;
    prompt: string;
    categoryId: number | null;
    tagIds: number[];
    createdAt: Date;
}

type SerializablePromptDto = {
    name: string;
    prompt: string;
    category: string | null;
    tags: string[];
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