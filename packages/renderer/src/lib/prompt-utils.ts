import { CategoryIdToCategory } from "./category-utils";
import { tagIdToTag } from "./tag-utils";

export function toPrompt(promptDto: PromptDto): Prompt {
    const category = CategoryIdToCategory(promptDto.categoryId)
    const matchedTags = tagIdToTag(promptDto.tagIds);

    return {
        id: promptDto.id,
        name: promptDto.name,
        prompt: promptDto.prompt,
        category,
        tags: matchedTags,
        createdAt: promptDto.createdAt,
    };
}