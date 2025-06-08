import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { usePromptStore } from '@/store';
import CategoryBadge from '../category/category-badge';
import CopyButton from '../shared/copy-button';
import TagBadgeList from '../tag/tag-badge-list';
import { Separator } from '../ui/separator';

interface PromptListItemProps {
    prompt: Prompt;
    onClick?: (prompt: Prompt) => void;
}

export default function PromptListItem({ prompt, onClick }: PromptListItemProps) {
    const setSearchFilter = usePromptStore((state) => state.setSearchFilter);
    const search = usePromptStore((state) => state.search);

    function onTagBadgeClick(tag: Tag) {
        setSearchFilter('tags', tag.name);
        search();
    }

    function onCategoryBadgeClick(category: Category) {
        setSearchFilter('category', category);
        search();
        console.log('Category badge clicked:', category);
    }

    function onPromptCardClick() {
        onClick?.(prompt);
    }

    return (
        <Card
            className="p-2 gap-2 hover:bg-muted/40 select-none cursor-pointer"
            onClick={onPromptCardClick}
        >
            <CardHeader className="p-0">
                <CardTitle className="text-sm font-semibold line-clamp-1 break-all">
                    {prompt.name}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-full relative group">
                <p className="text-sm text-muted-foreground text-ellipsis line-clamp-1 max-w-max">
                    {prompt.prompt}
                </p>
                <CopyButton
                    text={prompt.prompt}
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                />
            </CardContent>
            <Separator />
            <CardFooter className="p-0 flex gap-1">
                <CategoryBadge category={prompt.category} onBadgeClick={onCategoryBadgeClick} />
                <TagBadgeList tags={prompt.tags} onBadgeClick={onTagBadgeClick} />
            </CardFooter>
        </Card>
    );
}
