interface ICategoryController {
    getAllCategories(): Promise<IPCResponse<CategoryDto[]>>;
    addCategory(name: string): Promise<IPCResponse<CategoryDto>>;
    removeCategoryByName(name: string): Promise<IPCResponse<void>>;
}

interface ITagController {
    getAllTags(): Promise<IPCResponse<TagDto[]>>;
    addTag(name: string): Promise<IPCResponse<TagDto>>;
    removeTagByName(name: string): Promise<IPCResponse<void>>;
}

interface IPromptController {
    getAllPrompts(): Promise<IPCResponse<PromptDto[]>>;
    addPrompt(createPromptDto: CreatePromptDto): Promise<IPCResponse<PromptDto>>;
    updatePrompt(updatePromptDto: UpdatePromptDto): Promise<IPCResponse<PromptDto>>;
    addTagToPrompt(addTagToPromptDto: AddTagToPromptDto): Promise<IPCResponse<void>>;
    removeTagFromPrompt(removeTagFromPromptDto: RemoveTagFromPromptDto): Promise<IPCResponse<void>>;
    removePromptById(id: number): Promise<IPCResponse<void>>;
}