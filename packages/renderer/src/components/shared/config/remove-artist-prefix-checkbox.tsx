import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useConfigStore } from '@/store/config.store';

export default function RemoveArtistPrefixCheckbox() {
    const config = useConfigStore((state) => state.config);
    const setConfig = useConfigStore((state) => state.set);

    async function handleRemoveArtistPrefixChange(checked: boolean) {
        await setConfig('removeArtistPrefix', checked);
    }

    return (
        <div className="flex items-center gap-2">
            <Checkbox
                checked={config.removeArtistPrefix}
                onCheckedChange={handleRemoveArtistPrefixChange}
            />
            <Label>Eliminar artist:</Label>
        </div>
    );
}
