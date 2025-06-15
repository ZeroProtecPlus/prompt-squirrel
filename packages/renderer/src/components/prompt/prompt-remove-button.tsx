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
import { deleteSuccessMessage } from '@/lib/message';
import { cn } from '@/lib/utils';
import { usePromptStore } from '@/store';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';

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
    const removePrompt = usePromptStore((state) => state.removePrompt);

    async function handleRemovePrompt(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        if (!promptId) return;

        try {
            await removePrompt(promptId);
            onRemove?.();
            toast.success(deleteSuccessMessage('프롬프트'));
        } catch (error) {
            console.error('프롬프트 삭제 실패:', error);
            toast.error('프롬프트 삭제에 실패했습니다.');
        }
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
