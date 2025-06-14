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
                <DialogContent className="select-none sm:max-w-xl lg:max-w-2xl xl:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>설정</DialogTitle>
                        <DialogDescription>
                            앱에서 전반적으로 사용되는 설정을 관리합니다.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col space-y-2 col-span-1">
                            <Label className="font-semibold mb-2">일반</Label>
                            <PromptTypeSelect />

                            <Label className="font-semibold mt-4 mb-2">붙여넣기</Label>
                            <RemoveUnderbarCheckbox />
                            <RemoveArtistPrefixCheckbox />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
