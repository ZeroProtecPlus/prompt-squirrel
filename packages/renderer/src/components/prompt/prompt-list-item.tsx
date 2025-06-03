import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import CategoryBadge from '../category/category-badge';
import TagBadgeList from '../tag/tag-badge-list';
import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { josa } from 'es-hangul';
import { useState } from 'react';
import { Separator } from '../ui/separator';

interface PromptListItemProps {
    prompt: Prompt;
}

export default function PromptListItem({ prompt }: PromptListItemProps) {
    const [isCopied, setIsCopied] = useState(false);

    async function handleContentClick(e: React.MouseEvent) {
        e.stopPropagation();
        await navigator.clipboard.writeText(prompt.prompt);
        toast.success(`${josa(`"${prompt.name}"`, '이/가')} 클립보드에 복사되었습니다.`);

        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }
        , 2000);
    }

    return (
        <Card className="p-2 gap-2 hover:bg-muted/40 select-none">
            <CardHeader className="p-0">
                <CardTitle className="text-sm font-semibold">{prompt.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-full relative group" onClick={handleContentClick}>
                <p className="text-sm text-muted-foreground text-ellipsis line-clamp-1 max-w-max">
                    {prompt.prompt}
                </p>
                <Copy
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 text-accent-foreground ${
                    isCopied ? "opacity-0 scale-75 rotate-90" : "opacity-0 group-hover:opacity-100 scale-100 rotate-0"
                    }`}
                />
                <Check
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 text-green-500 ${
                    isCopied ? "opacity-0 group-hover:opacity-100 scale-100 rotate-0" : "opacity-0 scale-75 -rotate-90"
                    }`}
                />
            </CardContent>
            <Separator />
            <CardFooter className="p-0 flex gap-1">
                <CategoryBadge category={prompt.category} />
                <TagBadgeList tags={prompt.tags} />
            </CardFooter>
        </Card>
    );
}
