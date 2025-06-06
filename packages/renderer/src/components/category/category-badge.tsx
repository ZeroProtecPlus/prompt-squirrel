import { Badge } from '@/components/ui/badge';
import { NONE_CATEGORY, NONE_CATEGORY_ID } from './constants';

interface CategoryBadgeProps {
    category: Category;
    onBadgeClick?: (category: Category) => void;
}

export default function CategoryBadge({ category, onBadgeClick }: CategoryBadgeProps) {
    function handleBadgeClick(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        onBadgeClick?.(category);
    }

    return (
        <Badge
            variant={'outline'}
            className="bg-primary text-primary-foreground min-w-5 cursor-pointer"
            onClick={handleBadgeClick}
        >
            {category.id === NONE_CATEGORY_ID ? NONE_CATEGORY.name : category.name}
        </Badge>
    );
}
