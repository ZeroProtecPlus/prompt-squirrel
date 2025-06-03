import { Insertable } from "kysely";

export type PromptTagTable = {
    prompt_id: number;
    tag_id: number;
}

export type InsertablePromptTag = Insertable<PromptTagTable>;