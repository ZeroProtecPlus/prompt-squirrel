import { removeTagCommand } from '@/commands/tag';
import { addTagCommand } from '@/commands/tag/add-tag.command';
import { useTagStore } from '@/store';
import FilterableList from '../shared/filterable-list';

interface TagFilterableListProps {
    onTagClick: (tag: Tag) => void;
}

export default function TagFilterableList({ onTagClick }: TagFilterableListProps) {
    const tags = useTagStore((state) => state.tags);

    return (
        <FilterableList
            placeholder="태그 검색..."
            items={tags}
            onItemClick={(item) => onTagClick(item)}
            onEmptyButtonClick={addTagCommand}
            onDeleteItem={removeTagCommand}
        />
    );
}
