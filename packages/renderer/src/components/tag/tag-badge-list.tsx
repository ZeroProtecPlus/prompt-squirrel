import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { usePromptStore } from '@/store';
import { Ellipsis } from 'lucide-react';
import { Button } from '../ui/button';
import TagBadge from './tag-badge';

type TagBadgeListProps = {
    tags: Tag[];
};

export default function TagBadgeList({ tags }: TagBadgeListProps) {
    const setSearchFilter = usePromptStore((state) => state.setSearchFilter);
    const search = usePromptStore((state) => state.search);

    const visibleTags = tags.slice(0, 3);
    const hiddenTags = tags.slice(3);

    function onTagClick(tag: Tag) {
        setSearchFilter('tags', tag.name);
        search();
    }

    return (
        <div className="flex gap-2 overflow-hidden">
            {visibleTags.map((tag) => (
                <TagBadge key={tag.id} tag={tag} onBadgeClick={onTagClick} />
            ))}

            {hiddenTags.length > 0 && (
                <Tooltip delayDuration={200}>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-auto px-2 py-0.5 rounded-full text-xs cursor-pointer"
                        >
                            <Ellipsis />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white p-2 border rounded-md shadow-lg max-w-xs">
                        <div className="flex flex-wrap gap-1">
                            {hiddenTags.map((tag) => (
                                <TagBadge key={tag.id} tag={tag} onBadgeClick={onTagClick} />
                            ))}
                        </div>
                    </TooltipContent>
                </Tooltip>
            )}
        </div>
    );
}
