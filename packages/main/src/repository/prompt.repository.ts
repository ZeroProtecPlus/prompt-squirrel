import { SqliteError } from "better-sqlite3";
import { Effect } from "effect";
import { db } from "../database/db.js";
import { InsertPrompt, PromptTable, SelectPrompt, UpdatePrompt } from "../database/table/prompt.js";
import { InsertPromptTag } from "src/database/table/tag-prompt.js";

class PromptRepository {
    getAllPrompts(): Effect.Effect<SelectPrompt[], SqliteError> {
        return Effect.gen(function* () {
            yield* Effect.log('Repository getAllPrompts - before');
            const prompts = yield* Effect.promise(() => db.selectFrom('prompt').selectAll().execute());
            yield* Effect.log('Repository getAllPrompts - after');
            return prompts;
        });
    }

    addPrompt(insert: InsertPrompt): Effect.Effect<SelectPrompt, SqliteError> {
        return Effect.gen(function* () {
            yield* Effect.log('Repository addPrompt - before');
            const prompt = yield* Effect.promise(() => db.insertInto('prompt').values(insert).returningAll().executeTakeFirstOrThrow());
            yield* Effect.log('Repository addPrompt - after');
            return prompt;
        });
    }

    addTagsToPrompt(inserts: InsertPromptTag[]): Effect.Effect<void, SqliteError> {
        return Effect.gen(function* () {
            yield* Effect.log('Repository addTagsToPrompt - before');
            yield* Effect.promise(() => db.insertInto('prompt_tag').values(inserts).execute());
            yield* Effect.log('Repository addTagsToPrompt - after');
        });
    }

    removeTagFromPrompt(promptId: number, tagId: number): Effect.Effect<void, SqliteError> {
        return Effect.gen(function* () {
            yield* Effect.log('Repository removeTagFromPrompt - before', { promptId, tagId });
            yield* Effect.promise(() =>
                db.deleteFrom('prompt_tag')
                    .where('prompt_id', '=', promptId)
                    .where('tag_id', '=', tagId)
                    .execute(),
            );
            yield* Effect.log('Repository removeTagFromPrompt - after');
        });
    }

    updatePrompt(updatePrompt: UpdatePrompt): Effect.Effect<SelectPrompt, SqliteError> {
        return Effect.gen(function* () {
            yield* Effect.log('Repository updatePrompt - before', { updatePrompt });
            const updatedPrompt = yield* Effect.promise(() =>
                db.updateTable('prompt')
                    .set({
                        name: updatePrompt.name,
                        prompt: updatePrompt.prompt,
                        category_id: updatePrompt.category_id,
                    })
                    .where('id', '=', updatePrompt.id)
                    .returningAll()
                    .executeTakeFirstOrThrow()
            );
            yield* Effect.log('Repository updatePrompt - after', { updatedPrompt });
            return updatedPrompt;
        });
    }

    removePromptById(id: number): Effect.Effect<void, SqliteError> {
        return Effect.gen(function* () {
            yield* Effect.log('Repository removePromptById - before', { id });
            yield* Effect.promise(() =>
                db.deleteFrom('prompt')
                    .where('id', '=', id)
                    .execute(),
            );
            yield* Effect.log('Repository removePromptById - after');
        });
    }
}

export const promptRepository = new PromptRepository();