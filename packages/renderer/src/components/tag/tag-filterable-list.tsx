import { useTagStore } from "@/store";
import FilterableList from "../shared/filterable-list";

interface TagFilterableListProps {
    onTagClick: (tag: Tag) => void;
}

export default function TagFilterableList({ onTagClick }: TagFilterableListProps) {
    const tags = useTagStore((state) => state.tags);
    const addTag = useTagStore((state) => state.addTag);
    const removeTag = useTagStore((state) => state.removeTag);

    async function createNewTag(value: string) {
        await addTag(value);
    }

    async function deleteTag(tag: Tag) {
        await removeTag(tag.name);
    }

    return (
        <FilterableList
            placeholder="태그 검색..."
            items={tags}
            onItemClick={(item) => onTagClick(item)}
            onEmptyButtonClick={createNewTag}
            onDeleteItem={deleteTag}
        />
    );
}