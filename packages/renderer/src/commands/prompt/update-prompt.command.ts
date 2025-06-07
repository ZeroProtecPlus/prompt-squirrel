import { isServiceException } from '@/lib/utils';
import { usePromptStore } from '@/store';

export async function updatePromptCommand(
    updatePromptDto: Omit<UpdatePromptDto, 'categoryId'>,
    onError?: ServiceExceptionHandler,
) {
    const updatePrompt = usePromptStore.getState().updatePrompt;

    try {
        return await updatePrompt(
            {
                id: updatePromptDto.id,
                name: updatePromptDto.name,
                prompt: updatePromptDto.prompt,
            },
            true,
        );
    } catch (error) {
        if (isServiceException(error)) onError?.(error);
        console.error('Failed to update prompt:', error);
    }
}
