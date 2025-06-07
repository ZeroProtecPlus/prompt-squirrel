import { isServiceException } from '@/lib/utils';
import { usePromptStore } from '@/store';

export async function removeTagFromPromptCommand(
    prompt: Prompt | null,
    tag: Tag,
    onError?: ServiceExceptionHandler,
) {
    if (!prompt) return;

    const removeTagFromPrompt = usePromptStore.getState().removeTagFromPrompt;

    try {
        await removeTagFromPrompt({ promptId: prompt.id, tagId: tag.id }, prompt);
    } catch (error) {
        if (isServiceException(error)) onError?.(error);
        console.error('Failed to remove tag from prompt:', error);
    }
}
