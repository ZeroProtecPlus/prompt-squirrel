import { usePromptStore } from '@/store';
import { useState } from 'react';
import { CategoryFilterComboBox } from '../category/category-filter';
import TagFilterBox from '../tag/tag-filter-box';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import PromptDetail from './prompt-detail';
import PromptListItemEmpty from './prompt-list-empty';
import PromptListItem from './prompt-list-item';

export default function PromptList() {
    const prompts = usePromptStore((state) => state.prompts);

    const search = usePromptStore((state) => state.search);
    const setSearchString = usePromptStore((state) => state.setSearchString);
    const searchFilter = usePromptStore((state) => state.searchFilter);
    const setSearchFilter = usePromptStore((state) => state.setSearchFilter);

    const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

    function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
        const searchString = event.target.value;
        setSearchString(searchString);
        search();
    }

    function handleCategoryChange(category: Category | null) {
        const newValue = category?.id === searchFilter.category?.id ? null : category;
        setSearchFilter('category', newValue);
        search();
    }

    function handleTagFilterBadgeClick(tag: string) {
        setSearchFilter('tags', tag);
        search();
    }

    function handlePromptClick(prompt: Prompt) {
        setSelectedPrompt(prompt);
    }

    return (
        <div className="flex flex-col h-full w-full p-2 space-y-2">
            <div className="flex items-center bg-muted/30">
                <Input
                    type="text"
                    placeholder="프롬프트 검색..."
                    onChange={handleSearch}
                    className="w-full"
                />
            </div>
            <div className="h-9 flex gap-1">
                <div className="flex-0">
                    <CategoryFilterComboBox
                        onSelect={handleCategoryChange}
                        value={searchFilter.category}
                    />
                </div>
                <div className="flex-1">
                    <TagFilterBox
                        value={searchFilter.tags}
                        onBadgeClick={handleTagFilterBadgeClick}
                    />
                </div>
            </div>
            <ScrollArea className="overflow-y-auto">
                <div className="flex flex-col gap-1">
                    {prompts.length === 0 ? (
                        <PromptListItemEmpty />
                    ) : (
                        prompts.map((prompt) => (
                            <PromptListItem
                                key={prompt.id}
                                prompt={prompt}
                                onClick={handlePromptClick}
                            />
                        ))
                    )}
                </div>
            </ScrollArea>

            <PromptDetail prompt={selectedPrompt} onClose={() => setSelectedPrompt(null)} />
        </div>
    );
}
