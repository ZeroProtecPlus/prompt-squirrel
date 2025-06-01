import { Badge } from '@/components/ui/badge';
import { usePromptStore } from '@/store';
import { NONE_CATEGORY, NONE_CATEGORY_ID } from './constants';

interface CategoryBadgeProps {
    category: Category;
}

export default function CategoryBadge({ category }: CategoryBadgeProps) {
    const setSearchFilter = usePromptStore((state) => state.setSearchFilter);
    const search = usePromptStore((state) => state.search);

    function onClickCategory() {
        if (!category) return;

        setSearchFilter('category', category);
        search();
    }

    return (
        <Badge
            variant={'outline'}
            className="bg-primary text-primary-foreground min-w-5 cursor-pointer"
            onClick={onClickCategory}
        >
            {category.id === NONE_CATEGORY_ID ? NONE_CATEGORY.name : category.name}
        </Badge>
    );
}
