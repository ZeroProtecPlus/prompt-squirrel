import { exportCommand } from '@/commands/menu';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { MenubarItem } from '@/components/ui/menubar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { usePromptStore } from '@/store';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

export default function ExportMenuItem() {
    const prompts = usePromptStore((state) => state.prompts);
    const type = useRef<ExportType>('squirrel');

    const [open, setOpen] = useState<boolean>(false);
    function onValueChange(value: string) {
        type.current = value as ExportType;
    }

    async function handleExport() {
        if (prompts.length === 0) return toast.warning('No hay prompts para exportar.');

        await exportCommand({
            prompts,
            type: type.current,
        });
        toast.success('Los prompts se han exportado correctamente.');
        setOpen(false);
    }

    function handleMenuItemClick(e: React.MouseEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();
        setOpen(true);
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <MenubarItem onClick={handleMenuItemClick}>Exportar</MenubarItem>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Exportar prompts</DialogTitle>
                        <DialogDescription>
                            Exporta prompts en varios formatos.
                        </DialogDescription>
                    </DialogHeader>
                    <RadioGroup defaultValue="squirrel" onValueChange={onValueChange}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="squirrel" id="export-squirrel" />
                            <Label htmlFor="export-squirrel">Prompts</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="templateloader" id="export-templateloader" />
                            <Label htmlFor="export-templateloader">Template Loader</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="wildcard" id="export-wildcard" />
                            <Label htmlFor="export-wildcard">Wildcard</Label>
                        </div>
                    </RadioGroup>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant={'outline'}>Cancelar</Button>
                        </DialogClose>
                        <Button onClick={handleExport}>Exportar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}