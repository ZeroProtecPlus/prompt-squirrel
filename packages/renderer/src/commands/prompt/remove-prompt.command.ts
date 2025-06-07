import { isServiceException } from '@/lib/utils';
import { usePromptStore } from '@/store';

export async function removePromptCommand(prompt: Prompt, onError?: ServiceExceptionHandler) {
    const removePrompt = usePromptStore.getState().removePrompt;

    try {
        await removePrompt(prompt);
    } catch (error) {
        if (isServiceException(error)) onError?.(error);
        console.error('Failed to remove prompt:', error);
    }
}
