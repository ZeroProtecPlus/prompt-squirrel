import { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely';

export type TagTable = {
    id: Generated<number>;
    name: string;
    created_at: ColumnType<Date, string | undefined, never>;
};

export type SelectTag = Selectable<TagTable>;
export type InsertTag = Insertable<TagTable>;
export type UpdateTag = Updateable<TagTable>;
