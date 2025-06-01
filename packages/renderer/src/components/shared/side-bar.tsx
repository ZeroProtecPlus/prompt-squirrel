import { useTagStore } from '@/store';
import FilterableList from './filterable-list';

export default function Sidebar() {
    const tags = useTagStore((state) => state.tags);

    return (
        <div className="w-4/12 min-w-48 max-w-64 border-r bg-muted/30 flex flex-col h-full">
            <FilterableList
                placeholder="태그 검색..."
                items={tags}
                onItemClick={(item) => console.log('Selected item:', item)}
            />
        </div>
    );
}
