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
        if (prompts.length === 0) return toast.warning('내보낼 프롬프트가 없습니다.');

        await exportCommand({
            prompts,
            type: type.current,
        });
        toast.success('프롬프트가 성공적으로 내보내졌습니다.');
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
                    <MenubarItem onClick={handleMenuItemClick}>내보내기</MenubarItem>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>프롬프트 내보내기</DialogTitle>
                        <DialogDescription>
                            프롬프트를 다양한 형식으로 내보냅니다.
                        </DialogDescription>
                    </DialogHeader>
                    <RadioGroup defaultValue="squirrel" onValueChange={onValueChange}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="squirrel" id="export-squirrel" />
                            <Label htmlFor="export-squirrel">프롬프트</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="templateloader" id="export-templateloader" />
                            <Label htmlFor="export-templateloader">템플릿 로더</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="wildcard" id="export-wildcard" />
                            <Label htmlFor="export-wildcard">와일드 카드</Label>
                        </div>
                    </RadioGroup>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant={'outline'}>취소</Button>
                        </DialogClose>
                        <Button onClick={handleExport}>내보내기</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
