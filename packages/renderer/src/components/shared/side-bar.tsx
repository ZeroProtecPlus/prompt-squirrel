import { useCategoryStore, usePromptStore, useTagStore } from '@/store';
import FilterableList from './filterable-list';

export default function Sidebar() {
    const tags = useTagStore((state) => state.tags);
    const categories = useCategoryStore((state) => state.categories);

    const setSearchFilter = usePromptStore((state) => state.setSearchFilter);
    const search = usePromptStore((state) => state.search);

    function onCategoryClick(category: Category) {
        console.log('Selected category:', category);
        setSearchFilter('category', category);
        search();
    }

    return (
        <div className="w-4/12 min-w-48 max-w-64 border-r bg-muted/30 flex flex-col h-full">
            <div className="flex-1 max-h-1/2">
                <FilterableList
                    placeholder="태그 검색..."
                    items={tags}
                    onItemClick={(item) => console.log('Selected item:', item)}
                />
            </div>

            <div className="flex-1 max-h-1/2">
                <FilterableList
                    placeholder="카테고리 검색..."
                    items={categories}
                    onItemClick={(item) => onCategoryClick(item)}
                />
            </div>
        </div>
    );
}
