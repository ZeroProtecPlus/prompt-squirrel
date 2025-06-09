import { toPrompt } from '@/lib/mapper';
import { useCategoryStore, usePromptStore, useTagStore } from '@/store';
import { fileTransferApi } from '@app/preload';

export async function importCommand() {
    const minisearch = usePromptStore.getState().minisearch;
    const search = usePromptStore.getState().search;
    const loadTags = useTagStore.getState().loadTags;
    const loadCategories = useCategoryStore.getState().loadCategories;

    const response = await fileTransferApi.importPrompts();
    if (!response.success) return Promise.reject(response.error);

    await loadTags();
    await loadCategories();

    const newPrompts = response.data;

    await minisearch.addAllAsync(newPrompts.map((prompt) => toPrompt(prompt)));
    search();
}
