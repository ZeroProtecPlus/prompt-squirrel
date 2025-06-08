import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Pencil, Save } from 'lucide-react';

interface EditSaveToggleProps {
    className?: string;
    value?: boolean;
    onEditMode?: () => void;
    onSaveMode?: () => void;
}

export default function EditSaveToggle({
    onEditMode,
    onSaveMode,
    className,
    value,
}: EditSaveToggleProps) {
    function handleEditToggle() {
        if (value) {
            onSaveMode?.();
        } else {
            onEditMode?.();
        }
    }

    return (
        <Button
            variant="ghost"
            className={cn('size-10 sm:size-8', className)}
            onClick={handleEditToggle}
        >
            <Pencil
                className={cn(
                    'size-5 absolute transition-all duration-300',
                    value ? 'opacity-0 scale-0' : 'opacity-100 scale-100',
                )}
            />
            <Save
                className={cn(
                    'size-5 absolute transition-all duration-300',
                    value ? 'opacity-100 scale-100' : 'opacity-0 scale-0',
                )}
            />
        </Button>
    );
}
