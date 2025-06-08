import { removePromptCommand } from '@/commands/prompt';
import { cn } from '@/lib/utils';
import { Trash } from 'lucide-react';
import { Button } from '../ui/button';

interface PromptRemoveButtonProps {
    className?: string;
    promptId: number | null;
    onRemove?: () => void;
}

export default function PromptRemoveButton({
    className,
    promptId,
    onRemove,
}: PromptRemoveButtonProps) {
    async function handleRemovePrompt(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        if (!promptId) return;

        await removePromptCommand(promptId);
        onRemove?.();
    }

    return (
        <Button
            className={cn('group flex items-center justify-center cursor-pointer', className)}
            variant={'ghost'}
            size={'icon'}
            onClick={handleRemovePrompt}
        >
            <Trash className="text-foreground group-hover:text-destructive transition-colors duration-300 stroke-3" />
        </Button>
    );
}
