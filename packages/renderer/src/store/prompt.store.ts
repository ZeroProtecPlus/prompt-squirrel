import { ALL_CATEGORY_ID, NONE_CATEGORY_ID } from '@/components/category/constants';
import { toPrompt } from '@/lib/mapper';
import { createSuccessMessage, deleteSuccessMessage, updateSuccessMessage } from '@/lib/message';
import { searchResultToPrompt } from '@/lib/search-utils';
import { tagIdToTag } from '@/lib/tag-utils';
import { promptApi } from '@app/preload';
import MiniSearch, { type SearchResult } from 'minisearch';
import { toast } from 'sonner';
import { create } from 'zustand';

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
    updatePrompt: (prompt: UpdatePromptDto, showToast?: boolean) => Promise<void>;
    addTagToPrompt: (addTagToPromptDto: AddTagToPromptDto, original: Prompt) => Promise<void>;
    removeTagToPrompt: (
        removeTagFromPromptDto: RemoveTagFromPromptDto,
        original: Prompt,
    ) => Promise<void>;
    removePrompt: (prompt: Prompt) => Promise<void>;
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
                results = minisearch.search(query, {
                    filter: (doc) => {
                        if (tagFilter(doc)) return false;
                        return true;
                    },
                });
            } else if (searchFilter.category?.id === NONE_CATEGORY_ID) {
                results = minisearch.search(query, {
                    filter: (doc) => {
                        if (doc.category.id !== NONE_CATEGORY_ID) return false;
                        if (tagFilter(doc)) return false;
                        return true;
                    },
                });
            } else {
                results = minisearch.search(query, {
                    filter: (doc) => {
                        if (categoryFilter(doc)) return false;
                        if (tagFilter(doc)) return false;
                        return true;
                    },
                });
            }

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
            console.log('Setting search filter:', by, value);
            set((state) => {
                const newSearchFilter = { ...state.searchFilter };

                if (by === 'category' && typeof value !== 'string') {
                    newSearchFilter.category = value;
                } else if (by === 'tags' && typeof value === 'string') {
                    if (newSearchFilter.tags.includes(value)) {
                        newSearchFilter.tags = newSearchFilter.tags.filter((tag) => tag !== value);
                    } else {
                        newSearchFilter.tags.push(value);
                    }
                }
                return { searchFilter: newSearchFilter };
            });
            console.log('Updated search filter:', get().searchFilter);
        },

        addPrompt: async (prompt: CreatePromptDto) => {
            const response = await promptApi.addPrompt(prompt);
            if (!response.success) return Promise.reject(response.error);

            const promptDto = response.data;

            const newPrompt = toPrompt(promptDto);

            minisearch.add(newPrompt);
            set((state) => ({
                prompts: [...state.prompts, newPrompt],
            }));
            toast.success(createSuccessMessage(prompt.name));
        },

        addTagToPrompt: async (addTagToPromptDto: AddTagToPromptDto, original: Prompt) => {
            const response = await promptApi.addTagToPrompt(addTagToPromptDto);
            if (!response.success) return Promise.reject(response.error);

            const tag = tagIdToTag(addTagToPromptDto.tagId);

            const updatedPrompt = {
                ...original,
                tags: [...original.tags, tag],
            };

            minisearch.replace(updatedPrompt);
            set((state) => ({
                prompts: state.prompts.map((p) => (p.id === updatedPrompt.id ? updatedPrompt : p)),
            }));
        },

        removeTagToPrompt: async (
            removeTagFromPromptDto: RemoveTagFromPromptDto,
            original: Prompt,
        ) => {
            const response = await promptApi.removeTagFromPrompt(removeTagFromPromptDto);
            if (!response.success) return Promise.reject(response.error);

            const tag = tagIdToTag(removeTagFromPromptDto.tagId);

            const updatedPrompt = {
                ...original,
                tags: original.tags.filter((t) => t.id !== tag.id),
            };

            minisearch.replace(updatedPrompt);
            set((state) => ({
                prompts: state.prompts.map((p) => (p.id === updatedPrompt.id ? updatedPrompt : p)),
            }));
        },

        updatePrompt: async (UpdatePromptDto: UpdatePromptDto, showToast = true) => {
            const response = await promptApi.updatePrompt(UpdatePromptDto);
            if (!response.success) return Promise.reject(response.error);

            const promptDto = response.data;

            const updatedPrompt = toPrompt(promptDto);

            minisearch.replace(updatedPrompt);
            set((state) => ({
                prompts: state.prompts.map((p) => (p.id === updatedPrompt.id ? updatedPrompt : p)),
            }));

            if (!showToast) return;

            toast.success(updateSuccessMessage(promptDto.name));
        },

        removePrompt: async (prompt: Prompt) => {
            const response = await promptApi.removePromptById(prompt.id);
            if (!response.success) return Promise.reject(response.error);

            minisearch.remove(prompt.id);
            set((state) => ({
                prompts: state.prompts.filter((p) => p.id !== prompt.id),
            }));

            toast.success(deleteSuccessMessage(prompt.name));
        },

        loadPrompts: async () => {
            console.log('Loading prompts...');
            const response = await promptApi.getAllPrompts();
            if (!response.success) return Promise.reject(response.error);

            const promptDtos = response.data;

            const prompts: Prompt[] = promptDtos.map(toPrompt);

            minisearch.removeAll();
            minisearch.addAll(prompts);
            set({ prompts });
        },
    };
});
