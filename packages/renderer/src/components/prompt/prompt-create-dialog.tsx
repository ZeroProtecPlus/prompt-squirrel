import { onPastePrompt } from '@/commands/event/on-paste';
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
    name: z.string().min(1, 'Debe tener al menos 1 carácter'),
    prompt: z.string().min(1, 'Introduce el contenido del prompt'),
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
                    message: 'Ya existe un prompt con este nombre.',
                });
            }
            console.error('Error al crear prompt:', error);
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
                    <AlertDialogTitle>Crear prompt</AlertDialogTitle>
                    <AlertDialogDescription>Crear un nuevo prompt.</AlertDialogDescription>
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
                                        <FormLabel>Nombre del prompt</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
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
                                        <FormLabel>Contenido del prompt</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                className="h-full w-full resize-none overflow-y-auto"
                                                onPaste={(e) =>
                                                    onPastePrompt(e, (v) => field.onChange(v))
                                                }
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
                                        <FormLabel>Categoría</FormLabel>
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
                                        <FormLabel>Etiquetas</FormLabel>
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
                                    Cancelar
                                </AlertDialogCancel>
                                <Button type="submit">Crear prompt</Button>
                            </AlertDialogFooter>
                        </form>
                    </Form>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
}
