import { onPastePrompt } from '@/commands/event/on-paste';
import {
    addTagToPromptCommand,
    removeTagFromPromptCommand,
    updatePromptCategoryCommand,
    updatePromptCommand,
} from '@/commands/prompt';
import { addThumbnailToPromptCommand } from '@/commands/prompt/add-thumbnail-to-prompt.command';
import { CategoryFilterComboBox } from '@/components/category/category-filter';
import CopyButton from '@/components/shared/copy-button';
import EditSaveToggle from '@/components/shared/edit-save-toggle';
import TagSelector from '@/components/tag/tag-seletor';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { cn, isServiceException } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import DragOverlay from '../shared/drag-overlay';
import PromptRemoveButton from './prompt-remove-button';
import PromptRemoveThumbnailButton from './prompt-remove-thumbnail-button';

interface PromptDetailProps {
    prompt: Prompt | null;
    onClose: () => void;
}

export default function PromptDetail({ prompt, onClose }: PromptDetailProps) {
    const open = !!prompt;

    const [isNameEditMode, setIsNameEditMode] = useState<boolean>(false);
    const [isPromptEditMode, setIsPromptEditMode] = useState<boolean>(false);

    const promptId = useRef<number | null>(prompt?.id || null);
    const [category, setCategory] = useState<Category | null>(prompt?.category || null);
    const [promptName, setPromptName] = useState<string>(prompt?.name || '');
    const originalPromptName = useRef<string>(promptName);
    const [promptText, setPromptText] = useState<string>(prompt?.prompt || '');
    const originalPromptText = useRef<string>(promptText);
    const [tags, setTags] = useState<Tag[]>(prompt?.tags || []);
    const [thumbnail, setThumbnail] = useState<string | null>(prompt?.thumbnail || null);

    useEffect(() => {
        if (!prompt) return;

        promptId.current = prompt.id;
        setCategory(prompt.category);
        setPromptName(prompt.name);
        originalPromptName.current = prompt.name;
        setPromptText(prompt.prompt);
        originalPromptText.current = prompt.prompt;
        setTags(prompt.tags);
        setThumbnail(prompt.thumbnail);

        setIsPromptEditMode(false);
        setIsNameEditMode(false);
    }, [prompt]);

    function onOpenChange(open: boolean) {
        if (!open) onClose();
    }

    async function handleCategorySelect(category: Category | null) {
        const newCategory = await updatePromptCategoryCommand(prompt, category);

        if (!newCategory) return;

        setCategory(newCategory);
    }

    async function handlePromptSave() {
        if (!prompt) return;
        setIsPromptEditMode(false);
        if (promptText === originalPromptText.current) return;

        const updatedPrompt = await updatePromptCommand({
            id: prompt.id,
            prompt: promptText,
        });

        originalPromptText.current = updatedPrompt.prompt;
    }

    async function handleNameSave() {
        if (!prompt) return;
        setIsNameEditMode(false);
        if (promptName === originalPromptName.current) return;

        try {
            const updatedPrompt = await updatePromptCommand({
                id: prompt.id,
                name: promptName,
            });
            originalPromptName.current = updatedPrompt.name;
        } catch (error) {
            if (isServiceException(error)) {
                setPromptName(originalPromptName.current);
                toast.error('Ya existe un prompt con el mismo nombre.');
                setIsNameEditMode(true);
            }
        }
    }

    async function handleNameInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            event.stopPropagation();
            event.preventDefault();
            await handleNameSave();
        } else if (event.key === 'Escape') {
            event.stopPropagation();
            event.preventDefault();
            setIsNameEditMode(false);
            setPromptName(originalPromptName.current);
        }
    }

    async function onImageDrop(fileList: FileList) {
        if (!prompt) return;
        try {
            const imageFile = fileList[0];

            if (!imageFile || !imageFile.type.startsWith('image/')) {
                toast.error('Solo se admiten archivos de imagen como miniatura.');
                return;
            }

            await addThumbnailToPromptCommand(prompt, imageFile);
            toast.success('La miniatura se ha subido correctamente.');
        } catch (error) {
            if (isServiceException(error))
                return toast.error(`Error al subir la miniatura.${error.name}`);

            toast.error('Error al subir la miniatura. Ocurrió un error desconocido.');
            console.error('Error al subir miniatura:', error);
        }
    }

    function onRemoveThumbnail() {
        if (!prompt) return;
        setThumbnail(null);
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="  md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
                <DragOverlay
                    className="flex flex-col h-full gap-2 p-4"
                    overlayMessage="Subir miniatura"
                    onDrop={onImageDrop}
                >
                    <div className="flex-shrink-0">
                        <SheetHeader className="p-0 pt-6">
                            <SheetTitle asChild>
                                <div className="flex items-center justify-between gap-2">
                                    <PromptRemoveButton
                                        promptId={promptId.current}
                                        onRemove={onClose}
                                    />
                                    <Input
                                        className={cn(
                                            'p-2 transition-all text-xl sm:text-2xl md:text-3xl lg:text-4xl',
                                            isNameEditMode
                                                ? 'border shadow-sm focus-visible:ring-1'
                                                : 'border-none shadow-none bg-transparent pointer-events-none focus-visible:ring-0 select-none text-ellipsis',
                                        )}
                                        value={promptName}
                                        onChange={(e) => setPromptName(e.target.value)}
                                        readOnly={!isNameEditMode}
                                        tabIndex={isNameEditMode ? 0 : -1}
                                        onKeyDown={handleNameInputKeyDown}
                                    />
                                    <EditSaveToggle
                                        value={isNameEditMode}
                                        onEditMode={() => setIsNameEditMode(true)}
                                        onSaveMode={handleNameSave}
                                    />
                                    <PromptRemoveThumbnailButton
                                        promptId={promptId.current}
                                        thumbnail={thumbnail}
                                        onRemove={onRemoveThumbnail}
                                    />
                                </div>
                            </SheetTitle>
                            <SheetDescription className="sr-only" />
                            <CategoryFilterComboBox
                                value={category}
                                onSelect={handleCategorySelect}
                            />
                        </SheetHeader>
                        <Separator className="mt-2" />
                    </div>

                    <div className="flex-1 flex flex-col space-y-2 min-h-0">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="prompt-textarea">Prompt</Label>
                            <EditSaveToggle
                                value={isPromptEditMode}
                                onEditMode={() => setIsPromptEditMode(true)}
                                onSaveMode={handlePromptSave}
                            />
                        </div>
                        <div className="relative group flex-1 min-h-0">
                            <Textarea
                                id="prompt-textarea"
                                className={cn(
                                    'h-full w-full resize-none overflow-y-auto',
                                    isPromptEditMode ? 'cursor-text' : 'cursor-default',
                                )}
                                onPaste={onPastePrompt}
                                value={promptText}
                                onChange={(e) => setPromptText(e.target.value)}
                                readOnly={!isPromptEditMode}
                            />

                            <CopyButton
                                className={cn(
                                    'size-10 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100',
                                    isPromptEditMode ? 'hidden' : 'block',
                                )}
                                text={promptText}
                            />
                        </div>
                    </div>

                    <div className="flex-shink-0 flex flex-col space-y-2">
                        <Label>Etiqueta</Label>
                        <TagSelector
                            className="h-12"
                            initialValue={tags}
                            onAddTag={(tag) => addTagToPromptCommand(prompt, tag)}
                            onRemoveTag={(tag) => removeTagFromPromptCommand(prompt, tag)}
                        />
                    </div>
                </DragOverlay>
            </SheetContent>
        </Sheet>
    );
}
