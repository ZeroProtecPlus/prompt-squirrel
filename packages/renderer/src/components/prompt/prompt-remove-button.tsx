import { removePromptCommand } from '@/commands/prompt';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Trash } from 'lucide-react';

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
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    className={cn(
                        'group flex items-center justify-center cursor-pointer',
                        className,
                    )}
                    variant={'ghost'}
                    size={'icon'}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Trash className="text-foreground group-hover:text-destructive transition-colors duration-300 stroke-3" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="select-none" onClick={(e) => e.stopPropagation()}>
                <AlertDialogHeader>
                    <AlertDialogTitle>프롬프트 삭제</AlertDialogTitle>
                    <AlertDialogDescription>
                        선택한 프롬프트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={(e) => e.stopPropagation()}>취소</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRemovePrompt}>삭제</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
