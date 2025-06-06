import { ALL_CATEGORY_ID, NONE_CATEGORY_ID } from "@/components/category/constants";

export function isStaticCategory(category: Category | null): boolean {
    if (!category) return false;
    return category.id === ALL_CATEGORY_ID || category.id === NONE_CATEGORY_ID;
}

export function toNullableCategory(category: Category): Category | null{
    if (category.id === ALL_CATEGORY_ID || category.id === NONE_CATEGORY_ID) {
        return null;
    }

    return category;
}