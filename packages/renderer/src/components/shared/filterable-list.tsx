import { Card, CardContent } from '@/components/ui/card';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';

type FilterableListItem = {
    id: number;
    name: string;
    count?: number;
};

interface FilterableListProps {
    placeholder?: string;
    items: FilterableListItem[];
    onItemClick?: (item: FilterableListItem) => void;
}

export default function FilterableList({ placeholder, items, onItemClick }: FilterableListProps) {
    return (
        <Card className="h-full">
            <CardContent className="p-0 h-full">
                <Command className="h-full">
                    <CommandInput placeholder={placeholder || '검색...'} />
                    <CommandList className="max-h-full">
                        <CommandEmpty>목록이 비었습니다.</CommandEmpty>
                        <CommandGroup>
                            <ScrollArea className="h-full">
                                {items.map((item) => (
                                    <CommandItem
                                        key={item.id}
                                        value={item.name}
                                        onSelect={() => onItemClick?.(item)}
                                        className="flex items-center justify-between cursor-pointer"
                                    >
                                        <span className="text-sm">{item.name}</span>
                                        {item.count && (
                                            <Badge variant={'secondary'} className="text-xs w-2">
                                                {item.count}
                                            </Badge>
                                        )}
                                    </CommandItem>
                                ))}
                            </ScrollArea>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </CardContent>
        </Card>
    );
}
