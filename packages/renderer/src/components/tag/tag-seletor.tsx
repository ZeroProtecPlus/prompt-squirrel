import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import TagFilterBox from "./tag-filter-box";
import TagFilterableList from "./tag-filterable-list";
import { useState } from "react";

interface TagSelectorProps {
    onChange?: (tags: Tag[]) => void;
}

export default function TagSelector({ onChange }: TagSelectorProps) {
    const [value, setValue] = useState<Tag[]>([]);

    function toggleTag(tag: Tag) {
        const newValue = value.includes(tag) ? value.filter(t => t !== tag) : [...value, tag];
        setValue(newValue);
        onChange?.(newValue);
    }

    function handleTagClick(tag: Tag) {
        console.log('Selected tag:', tag);
        toggleTag(tag);
    }

    function handleBadgeClick(tagName: string) {
        const tag = value.find(t => t.name === tagName);
        if (tag) {
            toggleTag(tag);
        }
    }

    return (
        <Popover modal={true}>
            <PopoverTrigger className="h-9">
                <TagFilterBox
                    value={value.map(tag => tag.name)}
                    onBadgeClick={handleBadgeClick}
                />
            </PopoverTrigger>
            <PopoverContent className='p-0'>
                <TagFilterableList 
                    onTagClick={handleTagClick}
                />
            </PopoverContent>
        </Popover>
    )
}