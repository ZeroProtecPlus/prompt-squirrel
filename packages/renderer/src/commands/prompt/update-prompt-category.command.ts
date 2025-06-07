import { staticCategoryToNull } from '@/lib/category-utils';
import { isServiceException } from '@/lib/utils';
import { usePromptStore } from '@/store';

export async function updatePromptCategoryCommand(
    prompt: Prompt | null,
    category: Category | null,
    onError?: ServiceExceptionHandler,
) {
    let newCategory: Category | null = null;
    if (!prompt) return undefined;
    if (category) newCategory = staticCategoryToNull(category);

    const updatePrompt = usePromptStore.getState().updatePrompt;

    try {
        const updatedPrompt = await updatePrompt(
            {
                id: prompt.id,
                categoryId: newCategory ? newCategory.id : null,
            },
            false,
        );

        return updatedPrompt.category;
    } catch (error) {
        if (isServiceException(error)) onError?.(error);
        console.error('Failed to update prompt category:', error);
    }
}
