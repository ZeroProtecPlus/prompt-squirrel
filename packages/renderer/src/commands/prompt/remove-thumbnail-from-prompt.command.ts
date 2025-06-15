import { toPrompt } from "@/lib/prompt-utils";
import { promptApi } from "@app/preload";

export async function removeThumbnailFromPromptCommand(promptId: number): Promise<Prompt> {
    const response = await promptApi.removeThumbnailFromPrompt(promptId);

    if (!response.success) return Promise.reject(response.error);

    return toPrompt(response.data);
}