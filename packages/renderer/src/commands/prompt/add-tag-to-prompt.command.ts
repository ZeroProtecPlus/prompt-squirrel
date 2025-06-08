import { isServiceException } from '@/lib/utils';
import { usePromptStore } from '@/store';

export async function addTagToPromptCommand(
    prompt: Prompt | null,
    tag: Tag,
    onError?: ServiceExceptionHandler,
) {
    if (!prompt) return;

    const addTagToPrompt = usePromptStore.getState().addTagToPrompt;

    try {
        await addTagToPrompt({ promptId: prompt.id, tagId: tag.id });
    } catch (error) {
        if (isServiceException(error)) onError?.(error);
        console.error('Failed to add tag to prompt:', error);
    }
}
