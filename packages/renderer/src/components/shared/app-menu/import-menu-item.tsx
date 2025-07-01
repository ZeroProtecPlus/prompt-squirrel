import { useLoading } from '@/components/hooks';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { MenubarItem } from '@/components/ui/menubar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { isServiceException } from '@/lib/utils';
import { useCategoryStore, usePromptStore, useTagStore } from '@/store';
import { fileTransferApi } from '@app/preload';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

type ImportDialogState = 'closed' | 'preview' | 'strategy';

export default function ImportMenuItem() {
    const { loading, stopLoading } = useLoading();
    const [dialogState, setDialogState] = useState<ImportDialogState>('closed');
    const [previewData, setPreviewData] = useState<ImportPreviewResult | null>(null);
    const strategyRef = useRef<DuplicateHandlingStrategy>('rename');

    const minisearch = usePromptStore((state) => state.minisearch);
    const search = usePromptStore((state) => state.search);
    const loadTags = useTagStore((state) => state.loadTags);
    const loadCategories = useCategoryStore((state) => state.loadCategories);

    const handleMenuItemClick = async () => {
        try {
            loading('Analizando archivo...');
            const response = await fileTransferApi.previewImport();
            
            if (!response.success) {
                throw response.error;
            }

            setPreviewData(response.data);
            
            if (response.data.duplicates.length > 0) {
                setDialogState('strategy');
            } else {
                // No duplicates, import directly
                await handleFinalImport();
            }
            
            stopLoading();
        } catch (error) {
            if (isServiceException(error)) {
                toast.error('Error al analizar el archivo.');
            }
            stopLoading();
        }
    };

    const handleFinalImport = async () => {
        if (!previewData) return;

        try {
            loading('Importando prompts...');
            
            const response = await fileTransferApi.importPromptsWithStrategy({
                filePath: previewData.filePath,
                duplicateStrategy: strategyRef.current,
            });

            if (!response.success) {
                throw response.error;
            }

            // Refresh the UI
            await loadTags();
            await loadCategories();

            const importedPrompts = response.data;
            
            // Reload all prompts to get the updated list
            search();
            
            toast.success(`${importedPrompts.length} prompts importados correctamente.`);
            setDialogState('closed');
            setPreviewData(null);
            stopLoading();
        } catch (error) {
            if (isServiceException(error)) {
                toast.error('Error al importar los prompts.');
            }
            stopLoading();
        }
    };

    const onStrategyChange = (value: string) => {
        strategyRef.current = value as DuplicateHandlingStrategy;
    };

    return (
        <>
            <MenubarItem onClick={handleMenuItemClick}>Importar</MenubarItem>
            
            <Dialog open={dialogState === 'strategy'} onOpenChange={(open) => !open && setDialogState('closed')}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Duplicados encontrados</DialogTitle>
                        <DialogDescription>
                            Se encontraron {previewData?.duplicates.length} prompts duplicados en el archivo. 
                            ¿Cómo deseas manejarlos?
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                        <div className="max-h-32 overflow-y-auto bg-muted p-3 rounded">
                            <p className="text-sm font-medium mb-2">Prompts duplicados:</p>
                            <ul className="text-sm space-y-1">
                                {previewData?.duplicates.map((name, index) => (
                                    <li key={index} className="text-muted-foreground">• {name}</li>
                                ))}
                            </ul>
                        </div>
                        
                        <RadioGroup defaultValue="rename" onValueChange={onStrategyChange}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="skip" id="strategy-skip" />
                                <Label htmlFor="strategy-skip">
                                    <span className="font-medium">Omitir</span>
                                    <br />
                                    <span className="text-sm text-muted-foreground">
                                        No importar prompts duplicados
                                    </span>
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="rename" id="strategy-rename" />
                                <Label htmlFor="strategy-rename">
                                    <span className="font-medium">Renombrar</span>
                                    <br />
                                    <span className="text-sm text-muted-foreground">
                                        Añadir un sufijo único a los nombres duplicados
                                    </span>
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="overwrite" id="strategy-overwrite" />
                                <Label htmlFor="strategy-overwrite">
                                    <span className="font-medium">Sobrescribir</span>
                                    <br />
                                    <span className="text-sm text-muted-foreground">
                                        Reemplazar prompts existentes con los del archivo
                                    </span>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancelar</Button>
                        </DialogClose>
                        <Button onClick={handleFinalImport}>
                            Importar {previewData?.totalPrompts} prompts
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}