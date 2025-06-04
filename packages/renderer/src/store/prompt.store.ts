import { ALL_CATEGORY_ID, NONE_CATEGORY, NONE_CATEGORY_ID } from '@/components/category/constants';
import { searchResultToPrompt } from '@/lib/search-utils';
import MiniSearch, { type SearchResult } from 'minisearch';
import { create } from 'zustand';
import { promptApi } from '@app/preload';
import { useCategoryStore } from './category.store';
import { useTagStore } from './tag.store';
import { toPrompt } from '@/lib/mapper';

type PromptState = {
    prompts: Prompt[];
};

type PromptSearchState = {
    searchFilter: SearchFilterOptions;
};

type PromptSearchAction = {
    search: () => Prompt[];
    setSearchString: (searchString?: string) => void;
    setSearchFilter(by: 'category', value: Category | null): void;
    setSearchFilter(by: 'tags', value: string): void;
    setSearchFilter(by: Filterable<Prompt>, value: string | Category | null): void;
};

type PromptAction = {
    addPrompt: (prompt: CreatePromptDto) => Promise<void>;
    removePrompt: (promptId: number) => Promise<void>;
    loadPrompts: () => Promise<void>;
};

export const usePromptStore = create<
    PromptState & PromptAction & PromptSearchState & PromptSearchAction
>((set, get) => {
    const minisearch = new MiniSearch({
        idField: 'id',
        fields: ['name', 'prompt', 'category', 'tags'],
        storeFields: ['id', 'name', 'prompt', 'category', 'tags', 'createdAt'],
        searchOptions: {
            fuzzy: 0,
            prefix: true,
            boost: {
                name: 5,
                prompt: 1,
                category: 2,
                tags: 2,
            },
        },
        autoVacuum: true,
    });

    return {
        prompts: [],
        searchFilter: {
            query: MiniSearch.wildcard,
            category: null,
            tags: [],
        },
        search: () => {
            const searchFilter = get().searchFilter;
            const query = searchFilter.query;

            const categoryFilter = (doc: SearchResult) =>
                searchFilter.category && doc.category.name !== searchFilter.category.name;

            const tagFilter = (doc: SearchResult) =>
                searchFilter.tags.length > 0 &&
                !searchFilter.tags.every(
                    (tagName) => !doc.tags.every((tag: Tag) => tag.name !== tagName),
                );

            let results: SearchResult[];

            if (searchFilter.category?.id === ALL_CATEGORY_ID) {
                console.log('Searching in all categories');
                results = minisearch.search(query, {
                    filter: (doc) => {
                        if (tagFilter(doc)) return false;
                        return true;
                    },
                });
            } else if (searchFilter.category?.id === NONE_CATEGORY_ID) {
                console.log('Searching in uncategorized prompts');
                results = minisearch.search(query, {
                    filter: (doc) => {
                        if (doc.category.id !== NONE_CATEGORY_ID) return false;
                        if (tagFilter(doc)) return false;
                        return true;
                    },
                });
            } else {
                console.log(`Searching in category: ${searchFilter.category?.name}`);
                results = minisearch.search(query, {
                    filter: (doc) => {
                        if (categoryFilter(doc)) return false;
                        if (tagFilter(doc)) return false;
                        return true;
                    },
                });
            }

            console.log(`Search results for "${String(query)}":`, results);

            const prompts = results.map(searchResultToPrompt);

            set({ prompts });

            return prompts;
        },

        setSearchString: (searchString?: string) => {
            set((state) => {
                const query = searchString?.trim() || MiniSearch.wildcard;
                const newSearchFilter = { ...state.searchFilter, query };
                return { searchFilter: newSearchFilter };
            });
        },

        setSearchFilter(by: Filterable<Prompt>, value: string | Category | null) {
            set((state) => {
                const newSearchFilter = { ...state.searchFilter };

                if (by === 'category' && typeof value !== 'string') {
                    console.log(`Setting category filter to: ${value?.name}`);
                    newSearchFilter.category = value;
                } else if (by === 'tags' && typeof value === 'string') {
                    console.log(`Toggling tag filter: ${value}`);
                    if (newSearchFilter.tags.includes(value)) {
                        newSearchFilter.tags = newSearchFilter.tags.filter((tag) => tag !== value);
                    } else {
                        newSearchFilter.tags.push(value);
                    }
                }
                console.log('Filter options updated:', newSearchFilter);
                return { searchFilter: newSearchFilter };
            });
        },

        addPrompt: async (prompt: CreatePromptDto) => {
            const response = await promptApi.addPrompt(prompt);
            if (!response.success) return Promise.reject(response.error);

            const promptDto = response.data;

            const category = prompt.categoryId === null
                ? NONE_CATEGORY
                : useCategoryStore.getState().categories.find((c) => c.id === prompt.categoryId) ?? NONE_CATEGORY;

            const matchedTags = prompt.tags
                .map((tag) => useTagStore.getState().tags.find((t) => t.id === tag.id))
                .filter((tag) => tag !== undefined);

            const newPrompt: Prompt = {
                ...promptDto,
                category,
                tags: matchedTags,
            };

            set((state) => {
                const updatedPrompts = [...state.prompts, newPrompt];
                minisearch.add(newPrompt);
                return { prompts: updatedPrompts };
            });
        },

        removePrompt: async (promptId: number) => {
            set((state) => {
                const updatedPrompts = state.prompts.filter((p) => p.id !== promptId);
                minisearch.discard(promptId);
                return { prompts: updatedPrompts };
            });

            await minisearch.vacuum();
        },

        loadPrompts: async () => {
            console.log('Loading prompts...');
            const response = await promptApi.getAllPrompts();
            if (!response.success) return Promise.reject(response.error);

            const promptDtos = response.data;

            const prompts: Prompt[] = promptDtos.map(toPrompt);

            minisearch.addAll(prompts);
            set({ prompts });
        },
    };
});
