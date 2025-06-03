import { ColumnType, Generated, Insertable, Selectable, Updateable } from "kysely";

export type PromptTable = {
    id: Generated<number>;
    name: string;
    prompt: string;
    category_id: number;
    created_at: ColumnType<Date, string | undefined, never>;
}

export type SelectPrompt = Selectable<PromptTable>;
export type InsertPrompt = Insertable<PromptTable>;
export type UpdatePrompt = Updateable<PromptTable>;