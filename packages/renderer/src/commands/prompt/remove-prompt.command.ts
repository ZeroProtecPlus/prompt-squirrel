import { usePromptStore } from '@/store';

export async function removePromptCommand(promptId: number) {
    const removePrompt = usePromptStore.getState().removePrompt;

    await removePrompt(promptId);
}
