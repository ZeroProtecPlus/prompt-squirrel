import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { CategoryFilterComboBox } from "@/components/category/category-filter";
import { useState } from "react";
import { ALL_CATEGORY_ID, NONE_CATEGORY_ID } from "@/components/category/constants";
import { Textarea } from "@/components/ui/textarea";
import { usePromptStore } from "@/store";

const formSchema = z.object({
    name: z.string().min(1, '1자 이상 입력해주세요'),
    prompt: z.string().min(1, '프롬프트 내용을 입력해주세요'),
    categoryId: z.number().nullable(),
    tags: z.array(z.object({
        id: z.number(),
        name: z.string(),
    })),
});

type PromptForm = z.infer<typeof formSchema>;

interface PromptCreateDialogProps {
    className?: string;
}

export default function PromptCreateDialog({ className }: PromptCreateDialogProps) {
    const addPrompt = usePromptStore((state) => state.addPrompt);

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
        const isStaticCategory = data.categoryId === NONE_CATEGORY_ID || 
                                data.categoryId === ALL_CATEGORY_ID ||
                                data.categoryId === null;

        data.categoryId = isStaticCategory ? null : data.categoryId;

        console.log('Form submitted:', data);

        await addPrompt(data);

        setOpen(false);
        form.reset();
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button className={cn("size-12 rounded-4xl animate-scale-pulse", className)}>
                    <Plus />
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>프롬프트 생성</AlertDialogTitle>
                    <AlertDialogDescription>새로운 프롬프트를 생성합니다.</AlertDialogDescription>
                </AlertDialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField 
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>프롬프트 이름</FormLabel>
                                    <FormControl>
                                        <Input placeholder='프롬프트 이름...' {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField 
                            control={form.control}
                            name="prompt"
                            render={({ field }) => (
                                <FormItem className="h-96 flex flex-col">
                                    <FormLabel>프롬프트 내용</FormLabel>
                                    <FormControl>
                                        <Textarea 
                                            placeholder='프롬프트 내용...' 
                                            className="overflow-y-auto h-full resize-none"
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
                                <FormItem>
                                    <FormLabel>카테고리</FormLabel>
                                    <FormControl>
                                        <CategoryFilterComboBox 
                                            onSelect={(category) => field.onChange(category?.id ?? null)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <AlertDialogFooter>
                            <AlertDialogCancel>취소</AlertDialogCancel>
                            <Button type="submit">프롬프트 생성</Button>
                        </AlertDialogFooter>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog>
    );
}