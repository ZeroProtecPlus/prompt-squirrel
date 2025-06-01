import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import CategoryBadge from '../category/category-badge';
import TagBadgeList from '../tag/tag-badge-list';

interface PromptListItemProps {
    prompt: Prompt;
}

export default function PromptListItem({ prompt }: PromptListItemProps) {
    return (
        <Card className="p-2 gap-2 hover:bg-muted/40">
            <CardHeader className="p-0">
                <CardTitle className="text-sm font-semibold">{prompt.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-full">
                <p className="text-sm text-muted-foreground text-ellipsis line-clamp-1 max-w-max">
                    {prompt.prompt}
                </p>
            </CardContent>
            <CardFooter className="p-0 flex gap-1">
                <CategoryBadge category={prompt.category} />
                <TagBadgeList tags={prompt.tags} />
            </CardFooter>
        </Card>
    );
}
