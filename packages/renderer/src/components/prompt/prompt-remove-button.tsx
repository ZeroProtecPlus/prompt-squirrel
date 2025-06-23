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
            toast.success(deleteSuccessMessage('prompt'));
        } catch (error) {
            console.error('Error al eliminar prompt:', error);
            toast.error('No se pudo eliminar el prompt.');
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
                    <AlertDialogTitle>Eliminar Prompt</AlertDialogTitle>
                    <AlertDialogDescription>
                        ¿Está seguro de que desea eliminar el prompt seleccionado? Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRemovePrompt}>Eliminar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
