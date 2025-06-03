import { create } from 'zustand';
import { MOCK_TAG } from './mock';

type TagState = {
    tags: Tag[];
};

type TagAction = {
    addTag: (tag: string) => void;
    removeTag: (tag: string) => void;
    loadTags: () => Promise<void>;
};

export const useTagStore = create<TagState & TagAction>((set) => ({
    tags: [],

    addTag: (tag: string) => {
        set((state) => {
            if (state.tags.some((t) => t.name === tag)) {
                return state;
            }
            const newTag: Tag = {
                id: state.tags.length + 1,
                name: tag,
                count: 0,
            };
            return { tags: [...state.tags, newTag] };
        });
    },

    removeTag: (tag: string) => {
        set((state) => ({
            tags: state.tags.filter((t) => t.name !== tag),
        }));
    },

    loadTags: async () => {
        console.log('Loading tags...');
        set({ tags: MOCK_TAG });
        console.log('Tags loaded:', MOCK_TAG.length);
        return Promise.resolve();
    },
}));
