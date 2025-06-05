import { Badge } from '@/components/ui/badge';
import { NONE_CATEGORY, NONE_CATEGORY_ID } from './constants';

interface CategoryBadgeProps {
    category: Category;
    onBadgeClick?: (category: Category) => void;
}

export default function CategoryBadge({ category, onBadgeClick }: CategoryBadgeProps) {
    return (
        <Badge
            variant={'outline'}
            className="bg-primary text-primary-foreground min-w-5 cursor-pointer"
            onClick={() => onBadgeClick?.(category)}
        >
            {category.id === NONE_CATEGORY_ID ? NONE_CATEGORY.name : category.name}
        </Badge>
    );
}
