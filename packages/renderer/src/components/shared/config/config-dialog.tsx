import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import PromptTypeSelect from './prompt-type-select';
import RemoveArtistPrefixCheckbox from './remove-artist-prefix-checkbox';
import RemoveUnderbarCheckbox from './remove-underbar-checkbox';

interface ConfigDialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export default function ConfigDialog({ open, onOpenChange }: ConfigDialogProps) {
    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="select-none lg:max-w-3xl xl:max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Configuración</DialogTitle>
                        <DialogDescription>
                            Gestiona la configuración general de la aplicación.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col space-y-2 col-span-1">
                            <Label className="font-semibold mb-2">General</Label>
                            <PromptTypeSelect />

                            <Label className="font-semibold mt-4 mb-2">Pegar</Label>
                            <RemoveUnderbarCheckbox />
                            <RemoveArtistPrefixCheckbox />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
