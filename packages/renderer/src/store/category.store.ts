import { STATIC_CATEGORIES } from '@/components/category/constants';
import { create } from 'zustand';
import { MOCK_CATEGORIES } from './mock';

type CategoryState = {
    categories: Category[];
};

type CategoryAction = {
    addCategory: (category: string) => void;
    removeCategory: (category: string) => void;
    loadCategories: () => Promise<void>;
};

export const useCategoryStore = create<CategoryState & CategoryAction>((set) => ({
    categories: [],

    addCategory: (category: string) => {
        set((state) => {
            if (state.categories.some((c) => c.name === category)) {
                return state;
            }
            const newCategory = { id: String(state.categories.length + 1), name: category };
            return { categories: [...state.categories, newCategory] };
        });
    },

    removeCategory: (category: string) => {
        set((state) => ({
            categories: state.categories.filter((c) => c.name !== category),
        }));
    },

    loadCategories: async () => {
        console.log('Loading categories...');
        const categories: Category[] = [...STATIC_CATEGORIES, ...MOCK_CATEGORIES];

        set({ categories });
        console.log('Categories loaded:', categories.length);
        return Promise.resolve();
    },
}));
