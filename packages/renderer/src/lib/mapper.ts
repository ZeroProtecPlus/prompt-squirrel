import { NONE_CATEGORY } from '@/components/category/constants';
import { useCategoryStore, useTagStore } from '@/store';

export function toPrompt(promptDto: PromptDto): Prompt {
    const categories = useCategoryStore.getState().categories;
    const allTags = useTagStore.getState().tags;

    const category =
        promptDto.categoryId === null
            ? NONE_CATEGORY
            : (categories.find((c) => c.id === promptDto.categoryId) ?? NONE_CATEGORY);

    const tags = promptDto.tagIds
        .map((id) => allTags.find((t) => t.id === id))
        .filter((tag) => tag !== undefined);

    return {
        ...promptDto,
        category,
        tags,
    };
}
