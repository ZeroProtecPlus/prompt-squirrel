import { InsertPrompt, PromptTable, SelectPrompt, UpdatePrompt } from '../database/table/prompt.js';
import { InsertPromptTag } from '../database/table/tag-prompt.js';

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

export function toUpdatePrompt(prompt: UpdatePromptDto): UpdatePrompt {
    return {
        id: prompt.id,
        name: prompt.name,
        prompt: prompt.prompt,
        category_id: prompt.categoryId === undefined ? undefined : prompt.categoryId,
    };
}

export function toInsertPromptTag(promptId: number, tagId: number): InsertPromptTag {
    return {
        prompt_id: promptId,
        tag_id: tagId,
    };
}
