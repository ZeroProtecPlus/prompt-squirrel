import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useConfigStore } from '@/store/config.store';

export default function RemoveUnderbarCheckbox() {
    const config = useConfigStore((state) => state.config);
    const setConfig = useConfigStore((state) => state.set);

    async function handleRemoveUnderbarChange(checked: boolean) {
        await setConfig('removeUnderbar', checked);
    }

    return (
        <div className="flex items-center gap-2">
            <Checkbox
                checked={config.removeUnderbar}
                onCheckedChange={handleRemoveUnderbarChange}
            />
            <Label>언더바 제거</Label>
        </div>
    );
}
