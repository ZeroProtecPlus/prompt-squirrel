import { Badge } from '@/components/ui/badge';

interface TagBadgeProps {
    tag: Tag;
    onBadgeClick?: (tag: Tag) => void;
}

export default function TagBadge({ tag, onBadgeClick }: TagBadgeProps) {
    return (
        <Badge
            variant={'outline'}
            className="text-xs cursor-pointer select-none"
            onClick={() => onBadgeClick?.(tag)}
        >
            {tag.name}
        </Badge>
    );
}
