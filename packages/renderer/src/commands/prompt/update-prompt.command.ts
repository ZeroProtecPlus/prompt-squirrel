import { usePromptStore } from '@/store';

export async function updatePromptCommand(updatePromptDto: Omit<UpdatePromptDto, 'categoryId'>) {
    const updatePrompt = usePromptStore.getState().updatePrompt;

    return await updatePrompt(
        {
            id: updatePromptDto.id,
            name: updatePromptDto.name,
            prompt: updatePromptDto.prompt,
        },
        true,
    );
}
