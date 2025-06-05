import { InsertPrompt, PromptTable, SelectPrompt } from "../database/table/prompt.js";

export function toPromptDto(promptTable: SelectPrompt, tagIds: number[]): PromptDto {
    return {
        id: promptTable.id,
        name: promptTable.name,
        prompt: promptTable.prompt,
        createdAt: promptTable.created_at,
        categoryId: promptTable.category_id,
        tagIds: tagIds || [],
    };
}

export function toInsertPrompt(prompt: CreatePromptDto): InsertPrompt {
    return {
        name: prompt.name,
        prompt: prompt.prompt,
        category_id: prompt.categoryId === null ? undefined : prompt.categoryId,
    };
}