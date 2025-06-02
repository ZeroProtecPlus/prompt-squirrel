export const ALL_CATEGORY_ID = -1;
export const NONE_CATEGORY_ID = -2;

export const ALL_CATEGORY: CategoryDto = {
    id: ALL_CATEGORY_ID,
    name: '전체',
    createdAt: new Date(),
};
export const NONE_CATEGORY: CategoryDto = {
    id: NONE_CATEGORY_ID,
    name: '미분류',
    createdAt: new Date(),
};

export const STATIC_CATEGORIES: CategoryDto[] = [ALL_CATEGORY, NONE_CATEGORY];
