import { createPromptCommand } from '@/commands/prompt';
import { CategoryFilterComboBox } from '@/components/category/category-filter';
import TagSelector from '@/components/tag/tag-seletor';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { cn, isServiceException } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
    name: z.string().min(1, '1자 이상 입력해주세요'),
    prompt: z.string().min(1, '프롬프트 내용을 입력해주세요'),
    categoryId: z.number().nullable(),
    tags: z.array(
        z.object({
            id: z.number(),
            name: z.string(),
        }),
    ),
});

type PromptForm = z.infer<typeof formSchema>;

interface PromptCreateDialogProps {
    className?: string;
}

export default function PromptCreateDialog({ className }: PromptCreateDialogProps) {
    const [open, setOpen] = useState<boolean>(false);

    const form = useForm<PromptForm>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            prompt: '',
            categoryId: null,
            tags: [],
        },
    });

    async function handleSubmit(data: PromptForm) {
        try {
            await createPromptCommand(data);
            setOpen(false);
            form.reset();
        } catch (error) {
            if (isServiceException(error) && error.code === 'CONFLICT') {
                form.setError('name', {
                    type: 'validate',
                    message: '이미 존재하는 프롬프트 이름입니다.',
                });
            }
            console.error('프롬프트 생성 실패:', error);
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button className={cn('size-12 rounded-4xl animate-scale-pulse', className)}>
                    <Plus className="size-8" />
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="h-[95vh] max-h-[700px] flex flex-col">
                <AlertDialogHeader>
                    <AlertDialogTitle>프롬프트 생성</AlertDialogTitle>
                    <AlertDialogDescription>새로운 프롬프트를 생성합니다.</AlertDialogDescription>
                </AlertDialogHeader>

                <div className="flex-1 overflow-hidden">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleSubmit)}
                            className="h-full flex flex-col space-y-4 p-1"
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="flex-shrink-0">
                                        <FormLabel>프롬프트 이름</FormLabel>
                                        <FormControl>
                                            <Input placeholder="프롬프트 이름..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="prompt"
                                render={({ field }) => (
                                    <FormItem className="flex-1 flex flex-col min-h-0">
                                        <FormLabel>프롬프트 내용</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="프롬프트 내용..."
                                                className="h-full w-full resize-none overflow-y-auto"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem className="flex-shrink-0">
                                        <FormLabel>카테고리</FormLabel>
                                        <FormControl>
                                            <CategoryFilterComboBox
                                                useStaticCategory={false}
                                                onSelect={(category) =>
                                                    field.onChange(category?.id ?? null)
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="tags"
                                render={({ field }) => (
                                    <FormItem className="flex-shrink-0">
                                        <FormLabel>태그</FormLabel>
                                        <FormControl>
                                            <TagSelector
                                                onChange={(tags) => field.onChange(tags)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Separator />
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => form.reset()}>
                                    취소
                                </AlertDialogCancel>
                                <Button type="submit">프롬프트 생성</Button>
                            </AlertDialogFooter>
                        </form>
                    </Form>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
}
