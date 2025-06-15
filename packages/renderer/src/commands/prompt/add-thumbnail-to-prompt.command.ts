import { toPrompt } from '@/lib/mapper';
import { usePromptStore } from '@/store';
import { promptApi } from '@app/preload';

export async function addThumbnailToPromptCommand(prompt: Prompt, imageFile: File): Promise<void> {
    const imageBuffer = await imageFile.arrayBuffer();

    const response = await promptApi.addThumbnailToPrompt({
        promptId: prompt.id,
        image: {
            name: imageFile.name,
            type: imageFile.type,
            buffer: new Uint8Array(imageBuffer),
        },
    });

    if (!response.success) return Promise.reject(response.error);

    const updatedPromptDto = response.data;

    const updatedPrompt = toPrompt(updatedPromptDto);

    usePromptStore.getState().minisearch.replace(updatedPrompt);
    usePromptStore.getState().search();
}
