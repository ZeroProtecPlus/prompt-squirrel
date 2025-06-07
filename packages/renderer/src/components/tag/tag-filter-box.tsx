import { useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import TagFilterBoxItem from './tag-filter-box-item';

interface TagFilterBoxProps {
    onBadgeClick?: (tag: string) => void;
    value?: string[];
}

export default function TagFilterBox({ onBadgeClick, value }: TagFilterBoxProps) {
    const [internalValue, setInternalValue] = useState<string[]>([]);

    const isControlled = value !== undefined;
    const selected = isControlled ? value : internalValue;

    function handleBadgeClick(tag: string) {
        if (!isControlled) {
            setInternalValue((prev) =>
                prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
            );
        }
        onBadgeClick?.(tag);
    }

    return (
        <div className="flex flex-wrap h-full bg-accent p-1 gap-1 rounded-md">
            <ScrollArea className="h-full">
                {selected.map((tag) => (
                    <TagFilterBoxItem key={tag} tag={tag} onBadgeClick={handleBadgeClick} />
                ))}
            </ScrollArea>
        </div>
    );
}
