'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

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
import { cn } from '@/lib/utils';
import { useCategoryStore } from '@/store';

interface CategoryFilterComboBoxProps {
    onSelect?: (category: Category | null) => void;
}

export function CategoryFilterComboBox({ onSelect }: CategoryFilterComboBoxProps) {
    const categories = useCategoryStore((state) => state.categories);

    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState<Category | null>(null);

    function onCategoryChange(currentCategory: Category) {
        console.log('Category filter combo box selected:', currentCategory);
        setOpen(false);

        if (value?.id === currentCategory.id) {
            setValue(null);
            onSelect?.(null);
            return;
        }

        setValue(currentCategory);
        onSelect?.(currentCategory);
    }

    return (
        <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="min-w-48 justify-between"
                >
                    {value ? value.name : '카테고리 선택...'}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="카테고리 검색..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>카테고리가 존재하지 않습니다.</CommandEmpty>
                        <CommandGroup>
                            {categories.map((category) => (
                                <CommandItem
                                    key={category.id}
                                    value={category.name}
                                    onSelect={() => onCategoryChange(category)}
                                >
                                    {category.name}
                                    <Check
                                        className={cn(
                                            'ml-auto',
                                            value?.id === category.id
                                                ? 'opacity-100'
                                                : 'opacity-0',
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
