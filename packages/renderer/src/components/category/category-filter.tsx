'use client';

import { Check, ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { isStaticCategory } from '@/lib/category-utils';
import { cn } from '@/lib/utils';
import { useCategoryStore } from '@/store';
import { useCallback, useState } from 'react';

interface CategoryFilterComboBoxProps {
    onSelect?: (category: Category | null) => void;
    value?: Category | null;
    useStaticCategory?: boolean;
}

export function CategoryFilterComboBox({
    onSelect,
    value,
    useStaticCategory,
}: CategoryFilterComboBoxProps) {
    const categories = useCategoryStore((state) => state.categories);
    const filteredCategories = useCallback(() => {
        return useStaticCategory
            ? categories
            : categories.filter((category) => !isStaticCategory(category.id));
    }, [categories, useStaticCategory]);

    const [open, setOpen] = useState<boolean>(false);
    const [internalValue, setInternalValue] = useState<Category | null>(value || null);

    const isControlled = value !== undefined;
    const selected = isControlled ? value : internalValue;

    function onCategoryChange(currentCategory: Category) {
        setOpen(false);

        const isSame = selected?.id === currentCategory.id;
        const newCategory = isSame ? null : currentCategory;

        if (!isControlled) {
            setInternalValue(newCategory);
        }

        onSelect?.(newCategory);
    }

    return (
        <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="min-w-36 justify-between"
                >
                    {selected ? selected.name : 'Seleccionar categoría...'}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Buscar categoría..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No se encontraron categorías.</CommandEmpty>
                        <CommandGroup>
                            {filteredCategories().map((category) => (
                                <CommandItem
                                    key={category.id}
                                    value={category.name}
                                    onSelect={() => onCategoryChange(category)}
                                >
                                    {category.name}
                                    <Check
                                        className={cn(
                                            'ml-auto',
                                            value?.id === category.id ? 'opacity-100' : 'opacity-0',
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
