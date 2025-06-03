import { usePromptStore } from '@/store';
import TagFilterBoxItem from './tag-filter-box-item';
import { ScrollArea } from '../ui/scroll-area';

export default function TagFilterBox() {
    const searchFilter = usePromptStore((state) => state.searchFilter);
    const setSearchFilter = usePromptStore((state) => state.setSearchFilter);
    const search = usePromptStore((state) => state.search);

    function onBadgeClick(tag: string) {
        setSearchFilter('tags', tag);
        search();
    }

    return (
        <ScrollArea className='h-full'>
            <div className="flex flex-wrap bg-accent p-1 gap-1 rounded-md">
                {searchFilter.tags.map((tag) => (
                    <TagFilterBoxItem key={tag} tag={tag} onBadgeClick={onBadgeClick} />
                ))}
            </div>
        </ScrollArea>
    );
}
