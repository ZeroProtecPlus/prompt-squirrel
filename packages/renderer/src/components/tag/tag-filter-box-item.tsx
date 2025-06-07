import { Badge } from '@/components/ui/badge';

type TagFilterBoxItemProps = {
    tag: string;
    onBadgeClick?: (tag: string) => void;
};

export default function TagFilterBoxItem({ tag, onBadgeClick }: TagFilterBoxItemProps) {
    function handleBadgeClick(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        onBadgeClick?.(tag);
    }

    return (
        <Badge
            variant={'outline'}
            className="h-5 bg-background text-foreground text-xs cursor-pointer select-none hover:bg-accent"
            onClick={handleBadgeClick}
        >
            {tag}
        </Badge>
    );
}
