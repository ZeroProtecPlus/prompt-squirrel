import { STATIC_CATEGORIES } from '@/components/category/constants';
import { categoryApi } from '@app/preload';
import { create } from 'zustand';

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

        console.log('Category added:', name);

        const category = response.data;

        set((state) => ({
            categories: [...state.categories, category],
        }));
    },

    removeCategory: async (name: string) => {
        const response = await categoryApi.removeCategoryByName(name);
        if (!response.success) return Promise.reject(response.error);

        set((state) => ({
            categories: state.categories.filter((c) => c.name !== name),
        }));
    },

    loadCategories: async () => {
        console.log('Loading categories...');
        const response = await categoryApi.getAllCategories();
        if (!response.success) return Promise.reject(response.error);

        const categories: CategoryDto[] = [...STATIC_CATEGORIES, ...response.data];

        set({ categories });
        console.log('Categories loaded:', categories.length);
    },
}));
