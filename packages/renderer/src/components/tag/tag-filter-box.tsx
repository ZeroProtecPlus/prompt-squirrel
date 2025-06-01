import { usePromptStore } from '@/store';
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
        <div className="flex flex-wrap h-full overflow-y-scroll bg-accent p-1 gap-1">
            {searchFilter.tags.map((tag) => (
                <TagFilterBoxItem key={tag} tag={tag} onBadgeClick={onBadgeClick} />
            ))}
        </div>
    );
}
