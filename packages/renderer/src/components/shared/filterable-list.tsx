import { Card, CardContent } from '@/components/ui/card';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Check, Edit, X } from 'lucide-react';
import { ALL_CATEGORY_ID, NONE_CATEGORY_ID } from '@/components/category/constants';

type FilterableListItem = {
    id: number;
    name: string;
    count?: number;
};

interface FilterableListProps {
    placeholder?: string;
    items: FilterableListItem[];
    onItemClick?: (item: FilterableListItem) => void;
    onEmptyButtonClick?: (value: string) => void;
    onDeleteItem?: (item: FilterableListItem) => void;
}

export default function FilterableList({ placeholder, items, onItemClick, onEmptyButtonClick, onDeleteItem }: FilterableListProps) {
    const [value, setValue] = useState<string>('');
    const [editMode, setEditMode] = useState<boolean>(false);

    function onValueChange(newValue: string) {
        setValue(newValue);
    }

    function handleDeleteItem(e: React.MouseEvent, item: FilterableListItem) {
        e.stopPropagation();
        onDeleteItem?.(item);
    }

    return (
        <Card className="h-full p-0">
            <CardContent className="p-0 h-full">
                <Command>
                    <CommandInput placeholder={placeholder || '검색...'} value={value} onValueChange={onValueChange} />
                    <CommandList className='h-full'>
                        <CommandEmpty asChild>
                            {onEmptyButtonClick && value.trim() ? (
                                <Button className='w-full h-full m-1' variant={'ghost'} onClick={() => onEmptyButtonClick(value)}>"{ value }" 생성</Button>
                            ) : (
                                <p className="text-muted-foreground text-sm text-center">
                                    검색 결과가 없습니다.
                                </p>
                            )}
                        </CommandEmpty>
                        <CommandGroup>
                            <ScrollArea className="h-full">
                                {items.map((item) => (
                                    <CommandItem
                                        key={item.id}
                                        value={item.name}
                                        onSelect={() => onItemClick?.(item)}
                                        className="flex items-center justify-between cursor-pointer"
                                    >
                                        <div className="flex items-center">
                                            {item.id !== ALL_CATEGORY_ID && item.id !== NONE_CATEGORY_ID && 
                                            <Button
                                                className={`
                                                group
                                                transition-all duration-300 flex items-center justify-center cursor-pointer
                                                ${editMode ? 'opacity-100 size-4 mr-2' : 'opacity-0 size-0'}
                                                `}
                                                variant={'ghost'}
                                                size={'icon'}
                                                onClick={(e) => handleDeleteItem(e, item)}
                                            >
                                                <X className='group-hover:text-destructive transition-colors duration-300'/>
                                            </Button>}
                                            <span className="max-w-max text-sm text-ellipsis">{item.name}</span>
                                        </div>
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
                    <div className='p-1 flex items-center justify-end border-t'>
                        <Button 
                            variant="outline"
                            onClick={() => setEditMode(!editMode)}
                        >
                            {editMode ? <Check /> : <Edit />}
                        </Button>
                    </div>
                </Command>
            </CardContent>
        </Card>
    );
}
