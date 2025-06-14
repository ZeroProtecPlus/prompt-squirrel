import { ALL_CATEGORY_ID, NONE_CATEGORY_ID } from '@/components/category/constants';
import { promptEventEmitter } from '@/lib/event-emitter';
import { toPrompt } from '@/lib/mapper';
import { createSuccessMessage, deleteSuccessMessage, updateSuccessMessage } from '@/lib/message';
import { searchResultToPrompt } from '@/lib/search-utils';
import { promptApi } from '@app/preload';
import { orderBy } from 'es-toolkit';
import MiniSearch, { type SearchResult } from 'minisearch';
import { toast } from 'sonner';
import { create } from 'zustand';

type PromptState = {
    minisearch: MiniSearch<Prompt>;
    prompts: Prompt[];
};

type PromptSearchState = {
    searchFilter: SearchFilterOptions;
    orderBy: OrderByOptions;
};

type PromptSearchAction = {
    search: () => void;
    setSearchString: (searchString?: string) => void;
    setSearchFilter(by: 'category', value: Category | null): void;
    setSearchFilter(by: 'tags', value: string): void;
    setSearchFilter(by: Filterable<Prompt>, value: string | Category | null): void;

    setOrderBy: (field: OrderField, direction: OrderDirection) => void;
};

type PromptAction = {
    addPrompt: (prompt: CreatePromptDto) => Promise<void>;
    updatePrompt: (prompt: UpdatePromptDto, showToast?: boolean) => Promise<Prompt>;
    addTagToPrompt: (addTagToPromptDto: AddTagToPromptDto) => Promise<void>;
    removeTagFromPrompt: (removeTagFromPromptDto: RemoveTagFromPromptDto) => Promise<void>;
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
        minisearch,
        prompts: [],
        searchFilter: {
            query: MiniSearch.wildcard,
            category: null,
            tags: [],
        },
        orderBy: {
            field: 'createdAt',
            direction: 'desc',
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

            const orderByOption = get().orderBy;

            const orderedPrompts = orderBy(
                prompts,
                [orderByOption.field],
                [orderByOption.direction],
            );

            set({ prompts: orderedPrompts });
            promptEventEmitter.emit('promptSearch');
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
        },

        setOrderBy: (field: OrderField, direction: OrderDirection) => {
            set({ orderBy: { field, direction } });
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

        addTagToPrompt: async (addTagToPromptDto: AddTagToPromptDto) => {
            const response = await promptApi.addTagToPrompt(addTagToPromptDto);
            if (!response.success) return Promise.reject(response.error);

            const PromptDto = response.data;

            const updatedPrompt = toPrompt(PromptDto);

            minisearch.replace(updatedPrompt);
            set((state) => ({
                prompts: state.prompts.map((p) => (p.id === updatedPrompt.id ? updatedPrompt : p)),
            }));
        },

        removeTagFromPrompt: async (removeTagFromPromptDto: RemoveTagFromPromptDto) => {
            const response = await promptApi.removeTagFromPrompt(removeTagFromPromptDto);
            if (!response.success) return Promise.reject(response.error);

            const promptDto = response.data;

            const updatedPrompt = toPrompt(promptDto);

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

            if (showToast) toast.success(updateSuccessMessage(promptDto.name));

            return updatedPrompt;
        },

        removePrompt: async (promptId: number) => {
            const response = await promptApi.removePromptById(promptId);
            if (!response.success) return Promise.reject(response.error);

            minisearch.remove({ id: promptId });
            set((state) => ({
                prompts: state.prompts.filter((p) => p.id !== promptId),
            }));

            toast.success(deleteSuccessMessage());
        },

        loadPrompts: async () => {
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
