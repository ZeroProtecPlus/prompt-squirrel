import { isStaticCategory } from '@/lib/category-utils';
import { usePromptStore } from '@/store';

export async function createPromptCommand(createPromptDto: CreatePromptDto) {
    const addPrompt = usePromptStore.getState().addPrompt;

    createPromptDto.categoryId = isStaticCategory(createPromptDto.categoryId)
        ? null
        : createPromptDto.categoryId;

    await addPrompt(createPromptDto);
}
