import { createSuccessMessage, deleteSuccessMessage } from '@/lib/message';
import { tagApi } from '@app/preload';
import { toast } from 'sonner';
import { create } from 'zustand';
import { usePromptStore } from './prompt.store';

type TagState = {
    tags: Tag[];
};

type TagAction = {
    addTag: (tag: string) => Promise<void>;
    removeTag: (tag: string) => Promise<void>;
    loadTags: () => Promise<void>;
};

export const useTagStore = create<TagState & TagAction>((set) => ({
    tags: [],

    addTag: async (tag: string) => {
        const response = await tagApi.addTag(tag);
        if (!response.success) return Promise.reject(response.error);

        console.log('Tag added:', tag);

        const newTag: TagDto = response.data;

        set((state) => ({
            tags: [...state.tags, newTag],
        }));
        toast.success(createSuccessMessage(tag));
    },

    removeTag: async (tag: string) => {
        const response = await tagApi.removeTagByName(tag);
        if (!response.success) return Promise.reject(response.error);

        set((state) => ({
            tags: state.tags.filter((t) => t.name !== tag),
        }));
        toast.success(deleteSuccessMessage(tag));
        usePromptStore.getState().loadPrompts();
    },

    loadTags: async () => {
        console.log('Loading tags...');
        const response = await tagApi.getAllTags();
        if (!response.success) return Promise.reject(response.error);

        const tags: Tag[] = [...response.data];

        set({ tags });
    },
}));
