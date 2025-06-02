import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely';

export type CategoryTable = {
    id: Generated<number>;
    name: string;
    created_at: ColumnType<Date, string | undefined, never>;
};

export type SelectCategory = Selectable<CategoryTable>;
export type InsertCategory = Insertable<CategoryTable>;
export type UpdateCategory = Updateable<CategoryTable>;
