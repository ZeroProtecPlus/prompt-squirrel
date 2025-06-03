import { usePromptStore } from '@/store';
import { ScrollArea } from '../ui/scroll-area';
import TagFilterBoxItem from './tag-filter-box-item';

export default function TagFilterBox() {
    const searchFilter = usePromptStore((state) => state.searchFilter);
    const setSearchFilter = usePromptStore((state) => state.setSearchFilter);
    const search = usePromptStore((state) => state.search);

    function onBadgeClick(tag: string) {
        setSearchFilter('tags', tag);
        search();
    }

    return (
        <div className="flex flex-wrap h-full bg-accent p-1 gap-1 rounded-md">
            <ScrollArea className="h-full">
                {searchFilter.tags.map((tag) => (
                    <TagFilterBoxItem key={tag} tag={tag} onBadgeClick={onBadgeClick} />
                ))}
            </ScrollArea>
        </div>
    );
}
