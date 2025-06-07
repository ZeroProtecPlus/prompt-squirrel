import { useCategoryStore, usePromptStore } from '@/store';
import TagFilterableList from '../tag/tag-filterable-list';
import FilterableList from './filterable-list';

export default function Sidebar() {
    const categories = useCategoryStore((state) => state.categories);
    const addCategory = useCategoryStore((state) => state.addCategory);
    const removeCategory = useCategoryStore((state) => state.removeCategory);

    const setSearchFilter = usePromptStore((state) => state.setSearchFilter);
    const search = usePromptStore((state) => state.search);

    function onTagClick(tag: Tag) {
        console.log('Selected tag:', tag);
        setSearchFilter('tags', tag.name);
        search();
    }

    // Category
    function onCategoryClick(category: Category) {
        console.log('Selected category:', category);
        setSearchFilter('category', category);
        search();
    }

    async function createNewCategory(value: string) {
        await addCategory(value);
    }

    async function deleteCategory(category: Category) {
        await removeCategory(category.name);
    }

    return (
        <div className="w-4/12 min-w-48 max-w-64 border-r bg-muted/30 flex flex-col h-full">
            <div className="flex-1 max-h-1/2">
                <TagFilterableList onTagClick={onTagClick} />
            </div>
            <div className="flex-1 max-h-1/2">
                <FilterableList
                    placeholder="카테고리 검색..."
                    items={categories}
                    onItemClick={(item) => onCategoryClick(item)}
                    onEmptyButtonClick={createNewCategory}
                    onDeleteItem={deleteCategory}
                />
            </div>
        </div>
    );
}
