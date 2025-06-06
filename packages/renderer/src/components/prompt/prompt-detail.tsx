import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import TagSelector from '@/components/tag/tag-seletor';
import { Textarea } from '@/components/ui/textarea';
import { CategoryFilterComboBox } from '../category/category-filter';
import { Separator } from '../ui/separator';
import { toNullableCategory } from '@/lib/category-utils';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Edit, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '../ui/label';
import CopyButton from '../shared/copy-button';

interface PromptDetailProps {
    prompt: Prompt | null;
    onClose: () => void;
}

export default function PromptDetail({ prompt, onClose }: PromptDetailProps) {
    const [isEditMode, setIsEditMode] = useState<boolean>(false);

    const [promptText, setPromptText] = useState<string>(prompt?.prompt || '');

    const open = !!prompt;

    useEffect(() => {
        if (prompt) {
            setPromptText(prompt.prompt);
            setIsEditMode(false);
        }
    }, [prompt]);

    function onOpenChange(open: boolean) {
        if (!open) onClose();
    }

    function handleCategorySelect(category: Category | null) {
        let newCategory: Category | null = null;

        if (category) newCategory = toNullableCategory(category);

        console.log('New category:', newCategory);
    }

    function handleAddTag(tag: Tag) {
        console.log('태그 추가:', tag);
    }

    function handleRemoveTag(tag: Tag) {
        console.log('태그 제거:', tag);
    }

    function handleEditToggle() {
        if (isEditMode) {
            setIsEditMode(false);
            console.log('프롬프트 저장');
        }
        else {
            setIsEditMode(true);
            console.log('프롬프트 편집 모드 활성화');
        }
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className='p-4 gap-2 md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl'>
                <div className='flex-shrink-0'>
                    <SheetHeader className='p-0 pt-4'>
                        <SheetTitle>{prompt?.name}</SheetTitle>
                        <SheetDescription className='sr-only' />
                        <CategoryFilterComboBox value={prompt?.category} onSelect={handleCategorySelect} />
                    </SheetHeader>
                    <Separator className='mt-2'/>
                </div>

                <div className='flex-1 flex flex-col space-y-2 min-h-0'>
                    <div className='flex items-center justify-between'>
                        <Label htmlFor='prompt-textarea'>프롬프트</Label>
                        <Button
                            variant="outline"
                            className="size-10 sm:size-8"
                            onClick={handleEditToggle}
                        >
                            <Edit className={cn("size-5 absolute transition-all duration-300",
                                isEditMode ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                            )} />
                            <Save className={cn("size-5 absolute transition-all duration-300",
                                isEditMode ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                            )} />
                        </Button>
                    </div>
                    <div className='relative group flex-1 min-h-0'>
                        <Textarea
                            id='prompt-textarea'
                            className={cn(
                                "h-full w-full resize-none overflow-y-auto",
                                isEditMode ? 'cursor-text' : 'cursor-default'
                            )}
                            value={promptText}
                            onChange={(e) => setPromptText(e.target.value)}
                            readOnly={!isEditMode}
                        />
                        
                        <CopyButton
                            className={cn(
                                'size-10 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100',
                                isEditMode ? 'hidden' : 'block'
                            )}
                            text={promptText}
                        />
                    </div>
                </div>

                <div className='flex-shink-0 flex flex-col space-y-2'>
                    <Label>태그</Label>
                    <TagSelector
                        className='h-12'
                        initialValue={prompt?.tags}
                        onAddTag={handleAddTag}
                        onRemoveTag={handleRemoveTag}
                    />
                </div>
            </SheetContent>
        </Sheet>
    );
}
