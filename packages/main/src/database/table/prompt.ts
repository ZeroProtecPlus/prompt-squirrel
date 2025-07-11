import { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely';

export type PromptTable = {
    id: Generated<number>;
    name: string;
    prompt: string;
    category_id: number | null;
    thumbnail: string | null;
    created_at: ColumnType<Date, string | undefined, never>;
};

export type SelectPrompt = Selectable<PromptTable>;
export type InsertPrompt = Insertable<PromptTable>;
export type UpdatePrompt = Pick<SelectPrompt, 'id'> & Omit<Updateable<PromptTable>, 'id'>;
