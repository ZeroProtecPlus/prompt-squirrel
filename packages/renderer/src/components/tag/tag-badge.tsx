import { Badge } from '@/components/ui/badge';

interface TagBadgeProps {
    tag: Tag;
    onBadgeClick?: (tag: Tag) => void;
}

export default function TagBadge({ tag, onBadgeClick }: TagBadgeProps) {
    function onBadgeClickHandler(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        onBadgeClick?.(tag);
    }

    return (
        <Badge
            variant={'outline'}
            className="text-xs cursor-pointer select-none"
            onClick={onBadgeClickHandler}
        >
            {tag.name}
        </Badge>
    );
}
