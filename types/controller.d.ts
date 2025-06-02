interface ICategoryController {
    getAllCategories(): Promise<IPCResponse<CategoryDto[]>>;
    addCategory(name: string): Promise<IPCResponse<CategoryDto>>;
    removeCategoryByName(name: string): Promise<IPCResponse<void>>;
}