import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useConfigStore } from '@/store/config.store';

export default function PromptTypeSelect() {
    const config = useConfigStore((state) => state.config);
    const setConfig = useConfigStore((state) => state.set);

    async function handlePromptTypeChange(value: string) {
        if (value !== 'local' && value !== 'nai') return;

        await setConfig('promptType', value);
    }

    return (
        <div className="flex justify-between space-x-2">
            <Label>Tipo de prompt</Label>
            <Select onValueChange={handlePromptTypeChange} defaultValue={config.promptType}>
                <SelectTrigger className="flex-1 max-w-32" size="sm">
                    <SelectValue placeholder={config.promptType === 'local' ? 'Local' : 'NAI'} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="local">Local</SelectItem>
                    <SelectItem value="nai">NAI</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
