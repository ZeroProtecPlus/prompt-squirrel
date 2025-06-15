import { STATIC_CATEGORIES } from '@/components/category/constants';
import { createSuccessMessage, deleteSuccessMessage } from '@/lib/message';
import { categoryApi } from '@app/preload';
import { toast } from 'sonner';
import { create } from 'zustand';
import { usePromptStore } from './prompt.store';

type CategoryState = {
    categories: CategoryDto[];
};

type CategoryAction = {
    addCategory: (category: string) => Promise<void>;
    removeCategory: (category: string) => Promise<void>;
    loadCategories: () => Promise<void>;
};

export const useCategoryStore = create<CategoryState & CategoryAction>((set) => ({
    categories: [],

    addCategory: async (name: string) => {
        const response = await categoryApi.addCategory(name);
        if (!response.success) return Promise.reject(response.error);

        const category = response.data;

        set((state) => ({
            categories: [...state.categories, category],
        }));
        toast.success(createSuccessMessage(name));
    },

    removeCategory: async (name: string) => {
        const response = await categoryApi.removeCategoryByName(name);
        if (!response.success) return Promise.reject(response.error);

        set((state) => ({
            categories: state.categories.filter((c) => c.name !== name),
        }));
        toast.success(deleteSuccessMessage(name));

        await usePromptStore.getState().loadPrompts();
    },

    loadCategories: async () => {
        const response = await categoryApi.getAllCategories();
        if (!response.success) return Promise.reject(response.error);

        const categories: CategoryDto[] = [...STATIC_CATEGORIES, ...response.data];

        set({ categories });
    },
}));
