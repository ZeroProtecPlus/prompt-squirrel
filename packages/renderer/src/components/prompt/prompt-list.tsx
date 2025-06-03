import { usePromptStore } from '@/store';
import { CategoryFilterComboBox } from '../category/category-filter';
import TagFilterBox from '../tag/tag-filter-box';
import { Input } from '../ui/input';
import PromptListItemEmpty from './prompt-list-empty';
import PromptListItem from './prompt-list-item';
import { ScrollArea } from '../ui/scroll-area';

export default function PromptList() {
    const prompts = usePromptStore((state) => state.prompts);
    const search = usePromptStore((state) => state.search);
    const setSearchString = usePromptStore((state) => state.setSearchString);

    function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
        const searchString = event.target.value;
        setSearchString(searchString);
        search();
    }

    return (
        <div className="flex flex-col h-full w-full p-4 space-y-2">
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
                    <CategoryFilterComboBox />
                </div>
                <div className="flex-1">
                    <TagFilterBox />
                </div>
            </div>
            <ScrollArea className="overflow-y-auto">
                <div className="flex flex-col gap-1">
                    {prompts.length === 0 ? (
                        <PromptListItemEmpty />
                    ) : (
                        prompts.map((prompt) => <PromptListItem key={prompt.id} prompt={prompt} />)
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
