import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Image, List } from 'lucide-react';

export type ViewMode = 'list' | 'image';

interface ViewToggleButtonProps {
    value: ViewMode;
    onChange: (value: ViewMode) => void;
}

export default function ViewToggleButton({ value, onChange }: ViewToggleButtonProps) {
    function handleValueChange(newValue: ViewMode) {
        if (!newValue) return;

        onChange(newValue);
    }

    return (
        <ToggleGroup type="single" value={value} onValueChange={handleValueChange}>
            <ToggleGroupItem value="list">
                <List />
            </ToggleGroupItem>
            <ToggleGroupItem value="image">
                <Image />
            </ToggleGroupItem>
        </ToggleGroup>
    );
}
