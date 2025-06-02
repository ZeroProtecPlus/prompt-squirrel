import { SelectCategory } from '../database/table/category.js';

export function toCategoryDto(category: SelectCategory): CategoryDto {
    return {
        id: category.id,
        name: category.name,
        createdAt: category.created_at,
    };
}
