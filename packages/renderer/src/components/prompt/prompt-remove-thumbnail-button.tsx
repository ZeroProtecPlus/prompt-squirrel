import { removeThumbnailFromPromptCommand } from '@/commands/prompt/remove-thumbnail-from-prompt.command';
import { usePromptStore } from '@/store';
import { ImageMinus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';

interface PromptRemoveThumbnailButtonProps {
    promptId: number | null;
    thumbnail: string | null;
    onRemove?: () => void;
}

export default function PromptRemoveThumbnailButton({
    promptId,
    thumbnail,
    onRemove,
}: PromptRemoveThumbnailButtonProps) {
    const miniSearch = usePromptStore((state) => state.minisearch);
    const search = usePromptStore((state) => state.search);

    async function handleRemoveThumbnail(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();

        if (!promptId || !thumbnail) return;
        const prompt = await removeThumbnailFromPromptCommand(promptId);

        miniSearch.replace(prompt);
        onRemove?.();
        search();
        toast.success('썸네일이 제거되었습니다.');
    }

    return (
        <Button onClick={handleRemoveThumbnail} variant="ghost" size="icon" disabled={!thumbnail}>
            <ImageMinus />
        </Button>
    );
}
