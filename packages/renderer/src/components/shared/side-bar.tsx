import { useCategoryStore, usePromptStore, useTagStore } from '@/store';
import FilterableList from './filterable-list';

export default function Sidebar() {
    const tags = useTagStore((state) => state.tags);
    const addTag = useTagStore((state) => state.addTag);
    const removeTag = useTagStore((state) => state.removeTag);

    const categories = useCategoryStore((state) => state.categories);
    const addCategory = useCategoryStore((state) => state.addCategory);
    const removeCategory = useCategoryStore((state) => state.removeCategory);

    const setSearchFilter = usePromptStore((state) => state.setSearchFilter);
    const search = usePromptStore((state) => state.search);

    // Tag
    function onTagClick(tag: Tag) {
        console.log('Selected tag:', tag);
        setSearchFilter('tags', tag.name);
        search();
    }

    async function createNewTag(value: string) {
        await addTag(value);
    }

    async function deleteTag(tag: Tag) {
        await removeTag(tag.name);
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
                <FilterableList
                    placeholder="태그 검색..."
                    items={tags}
                    onItemClick={(item) => onTagClick(item)}
                    onEmptyButtonClick={createNewTag}
                    onDeleteItem={deleteTag}
                />
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
