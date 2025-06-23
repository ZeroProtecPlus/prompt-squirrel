import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';
import { isStaticCategory } from '@/lib/category-utils';
import { Check, Edit, X } from 'lucide-react';
import { useState } from 'react';

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

export default function FilterableList({
    placeholder,
    items,
    onItemClick,
    onEmptyButtonClick,
    onDeleteItem,
}: FilterableListProps) {
    const [value, setValue] = useState<string>('');
    const [editMode, setEditMode] = useState<boolean>(false);

    function onValueChange(newValue: string) {
        setValue(newValue);
    }

    function handleDeleteItem(e: React.MouseEvent, item: FilterableListItem) {
        e.stopPropagation();
        onDeleteItem?.(item);
    }

    function handleEmptyButtonClick() {
        onEmptyButtonClick?.(value.trim());
        setValue('');
    }

    return (
        <Command>
            <CommandInput
                placeholder={placeholder || 'Buscar...'}
                value={value}
                onValueChange={onValueChange}
                onPressEnterKey={handleEmptyButtonClick}
            />
            <CommandList className="h-full">
                <CommandEmpty asChild>
                    {onEmptyButtonClick && value.trim() ? (
                        <Button
                            className="w-full h-full m-1"
                            variant={'ghost'}
                            onClick={handleEmptyButtonClick}
                        >
                            "Crear "{value}"
                        </Button>
                    ) : (
                        <p className="text-muted-foreground text-sm text-center">
                            No hay resultados de búsqueda.
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
                                    {!isStaticCategory(item.id) && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    className={`
                                                    group
                                                    transition-all duration-300 flex items-center justify-center cursor-pointer
                                                    ${editMode ? 'opacity-100 size-4 mr-1.5' : 'opacity-0 size-0'}
                                                `}
                                                    variant={'ghost'}
                                                    size={'icon'}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <X className="group-hover:text-destructive transition-colors duration-300" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent
                                                className="select-none"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Eliminar elemento</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        ¿Está seguro de que desea eliminar "{item.name}"? Esta acción no se puede deshacer.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        Cancelar
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={(e) => handleDeleteItem?.(e, item)}
                                                    >
                                                        Eliminar
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}
                                    <span className="max-w-max text-sm text-ellipsis">
                                        {item.name}
                                    </span>
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
            <div className="p-1 flex items-center justify-end border-t">
                <Button variant="outline" onClick={() => setEditMode(!editMode)}>
                    {editMode ? <Check /> : <Edit />}
                </Button>
            </div>
        </Command>
    );
}
