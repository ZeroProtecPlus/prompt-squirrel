import { CategoryFilterComboBox } from '@/components/category/category-filter';
import TagFilterBox from '@/components/tag/tag-filter-box';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePromptStore } from '@/store';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import PromptDetail from './prompt-detail';
import PromptListItemEmpty from './prompt-list-empty';
import PromptListItem from './prompt-list-item';
import PromptOrderSelect from './prompt-order-select';

export default function PromptList() {
    const prompts = usePromptStore((state) => state.prompts);
    const [visibleCount, setVisibleCount] = useState<number>(10);
    const observerRef = useRef<HTMLDivElement>(null);

    const search = usePromptStore((state) => state.search);
    const setSearchString = usePromptStore((state) => state.setSearchString);
    const searchFilter = usePromptStore((state) => state.searchFilter);
    const setSearchFilter = usePromptStore((state) => state.setSearchFilter);

    const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

    useEffect(() => {
        const observerEl = observerRef.current;
        if (!observerEl) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const target = entries[0];
                if (target.isIntersecting) {
                    setVisibleCount((prev) => Math.min(prev + 10, prompts.length));
                }
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 1.0,
            },
        );

        observer.observe(observerEl);

        return () => {
            if (observerEl) observer.unobserve(observerEl);
        };
    }, [prompts.length]);

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
                        useStaticCategory={true}
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
                <div className='flex-0'>
                    <PromptOrderSelect />
                </div>
            </div>
            <ScrollArea className="overflow-y-auto">
                <div className="flex flex-col gap-1">
                    {prompts.length === 0 ? (
                        <PromptListItemEmpty />
                    ) : (
                        prompts
                            .slice(0, visibleCount)
                            .map((prompt) => (
                                <PromptListItem
                                    key={prompt.id}
                                    prompt={prompt}
                                    onClick={handlePromptClick}
                                />
                            ))
                    )}

                    {visibleCount < prompts.length && (
                        <div ref={observerRef} className="h-10 flex items-center justify-center">
                            <LoaderCircle className="animate-spin text-muted-foreground" />
                        </div>
                    )}
                </div>
            </ScrollArea>

            <PromptDetail prompt={selectedPrompt} onClose={() => setSelectedPrompt(null)} />
        </div>
    );
}
