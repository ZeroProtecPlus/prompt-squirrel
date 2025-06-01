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
import { useCategoryStore, usePromptStore } from '@/store';

export function CategoryFilterComboBox() {
    const categories = useCategoryStore((state) => state.categories);
    const searchFilter = usePromptStore((state) => state.searchFilter);
    const setSearchFilter = usePromptStore((state) => state.setSearchFilter);
    const search = usePromptStore((state) => state.search);

    const [open, setOpen] = React.useState(false);

    function onCategoryChange(currentCategory: Category) {
        console.log('Selected category From CategoryFilter:', currentCategory);
        const newValue = currentCategory.id === searchFilter.category?.id ? null : currentCategory;
        setOpen(false);
        setSearchFilter('category', newValue);
        search();
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="min-w-48 justify-between"
                >
                    {searchFilter.category ? searchFilter.category.name : '카테고리 선택...'}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
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
                                            searchFilter.category?.id === category.id
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
