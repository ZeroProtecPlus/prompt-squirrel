import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import TagFilterBox from './tag-filter-box';
import TagFilterableList from './tag-filterable-list';

interface TagSelectorProps {
    className?: string;
    initialValue?: Tag[];
    onChange?: (tags: Tag[]) => void;
    onAddTag?: (tag: Tag) => void;
    onRemoveTag?: (tag: Tag) => void;
}

export default function TagSelector({
    onChange,
    className,
    initialValue,
    onAddTag,
    onRemoveTag,
}: TagSelectorProps) {
    const [value, setValue] = useState<Tag[]>(initialValue || []);

    function toggleTag(tag: Tag) {
        let newValue: Tag[];
        if (value.includes(tag)) {
            newValue = value.filter((t) => t !== tag);
            onRemoveTag?.(tag);
        } else {
            newValue = [...value, tag];
            onAddTag?.(tag);
        }
        setValue(newValue);
        onChange?.(newValue);
    }

    function handleTagClick(tag: Tag) {
        toggleTag(tag);
    }

    function handleBadgeClick(tagName: string) {
        const tag = value.find((t) => t.name === tagName);
        if (tag) toggleTag(tag);
    }

    return (
        <Popover modal={true}>
            <PopoverTrigger className={cn('h-9', className)}>
                <TagFilterBox
                    value={value.map((tag) => tag.name)}
                    onBadgeClick={handleBadgeClick}
                />
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <TagFilterableList onTagClick={handleTagClick} />
            </PopoverContent>
        </Popover>
    );
}
