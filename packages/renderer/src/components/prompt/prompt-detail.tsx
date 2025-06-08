import {
    addTagToPromptCommand,
    removeTagFromPromptCommand,
    updatePromptCategoryCommand,
} from '@/commands/prompt';
import TagSelector from '@/components/tag/tag-seletor';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { usePromptStore } from '@/store';
import { useEffect, useRef, useState } from 'react';
import { CategoryFilterComboBox } from '../category/category-filter';
import CopyButton from '../shared/copy-button';
import EditSaveToggle from '../shared/edit-save-toggle';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';

interface PromptDetailProps {
    prompt: Prompt | null;
    onClose: () => void;
}

export default function PromptDetail({ prompt, onClose }: PromptDetailProps) {
    const updatePrompt = usePromptStore((state) => state.updatePrompt);

    const [isNameEditMode, setIsNameEditMode] = useState<boolean>(false);
    const [isPromptEditMode, setIsPromptEditMode] = useState<boolean>(false);

    const [category, setCategory] = useState<Category | null>(prompt?.category || null);
    const [promptName, setPromptName] = useState<string>(prompt?.name || '');
    const originalPromptName = useRef<string>(promptName);
    const [promptText, setPromptText] = useState<string>(prompt?.prompt || '');
    const originalPromptText = useRef<string>(promptText);
    const [tags, setTags] = useState<Tag[]>(prompt?.tags || []);

    const open = !!prompt;

    useEffect(() => {
        if (!prompt) return;

        setCategory(prompt.category);
        setPromptName(prompt.name);
        originalPromptName.current = prompt.name;
        setPromptText(prompt.prompt);
        originalPromptText.current = prompt.prompt;
        setTags(prompt.tags);

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

        const updatedPrompt = await updatePrompt({
            id: prompt.id,
            prompt: promptText,
        });
        originalPromptText.current = updatedPrompt.prompt;
    }

    async function handleNameSave() {
        if (!prompt) return;
        setIsNameEditMode(false);
        if (promptName === originalPromptName.current) return;

        const updatedPrompt = await updatePrompt({
            id: prompt.id,
            name: promptName,
        });
        originalPromptName.current = updatedPrompt.name;
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

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="p-4 gap-2 md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
                <div className="flex-shrink-0">
                    <SheetHeader className="p-0 pt-6">
                        <SheetTitle asChild>
                            <div className="flex items-center justify-between gap-2">
                                <Input
                                    className={cn(
                                        'p-0 transition-all text-3xl sm:text-2xl md:text-3xl lg:text-4xl',
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
                            </div>
                        </SheetTitle>
                        <SheetDescription className="sr-only" />
                        <CategoryFilterComboBox value={category} onSelect={handleCategorySelect} />
                    </SheetHeader>
                    <Separator className="mt-2" />
                </div>

                <div className="flex-1 flex flex-col space-y-2 min-h-0">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="prompt-textarea">프롬프트</Label>
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
                    <Label>태그</Label>
                    <TagSelector
                        className="h-12"
                        initialValue={tags}
                        onAddTag={(tag) => addTagToPromptCommand(prompt, tag)}
                        onRemoveTag={(tag) => removeTagFromPromptCommand(prompt, tag)}
                    />
                </div>
            </SheetContent>
        </Sheet>
    );
}
