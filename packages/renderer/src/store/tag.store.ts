import { createSuccessMessage, deleteSuccessMessage } from '@/lib/message';
import { tagApi } from '@app/preload';
import { toast } from 'sonner';
import { create } from 'zustand';
import { usePromptStore } from './prompt.store';

type TagState = {
    tags: Tag[];
};

type TagAction = {
    addTag: (name: string) => Promise<void>;
    removeTag: (tag: Tag) => Promise<void>;
    loadTags: () => Promise<void>;
};

export const useTagStore = create<TagState & TagAction>((set) => ({
    tags: [],

    addTag: async (name: string) => {
        const response = await tagApi.addTag(name);
        if (!response.success) return Promise.reject(response.error);

        const newTag: TagDto = response.data;

        set((state) => ({
            tags: [...state.tags, newTag],
        }));
        toast.success(createSuccessMessage(name));
    },

    removeTag: async (tag: Tag) => {
        const response = await tagApi.removeTagByName(tag.name);
        if (!response.success) return Promise.reject(response.error);

        set((state) => ({
            tags: state.tags.filter((t) => t.name !== tag.name),
        }));
        toast.success(deleteSuccessMessage(tag.name));
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
