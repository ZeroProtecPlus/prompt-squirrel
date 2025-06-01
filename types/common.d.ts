type Filterable<T> = keyof Pick<T, Extract<keyof T, 'category' | 'tags'>>;

type SearchFilterOptions = {
    query: Query;
    category: Category | null;
    tags: string[];
}