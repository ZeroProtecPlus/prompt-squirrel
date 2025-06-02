import { CategoryTable } from './category.js';

export type {
    CategoryTable,
    SelectCategory,
    InsertCategory,
    UpdateCategory,
} from './category.js';

export type DB = {
    category: CategoryTable;
};
