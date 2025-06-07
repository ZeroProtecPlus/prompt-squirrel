import { Effect } from "effect";
import { db } from "../database/db.js";
import { InsertPrompt, PromptTable, SelectPrompt, UpdatePrompt } from "../database/table/prompt.js";
import { InsertPromptTag } from "../database/table/tag-prompt.js";
import { DatabaseException } from "../common/exceptions/database.exception.js";
import { handleSqliteError } from "../common/exceptions/sqlite-error.handler.js";

interface IPromptRepository {
    getAllPrompts(): Effect.Effect<SelectPrompt[], DatabaseException>;
    addPrompt(insert: InsertPrompt): Effect.Effect<SelectPrompt, DatabaseException>;
    addTagsToPrompt(inserts: InsertPromptTag[]): Effect.Effect<void, DatabaseException>;
    removeTagFromPrompt(promptId: number, tagId: number): Effect.Effect<void, DatabaseException>;
    updatePrompt(updatePrompt: UpdatePrompt): Effect.Effect<SelectPrompt, DatabaseException>;
    removePromptById(id: number): Effect.Effect<void, DatabaseException>;
}

class PromptRepository implements IPromptRepository {
    getAllPrompts() {
        return handleSqliteError(
            Effect.gen(function* () {
                yield* Effect.logDebug('Repository getAllPrompts - start');
                const prompts = yield* Effect.promise(() => db.selectFrom('prompt').selectAll().execute());
                yield* Effect.logDebug('Repository getAllPrompts - end');
                return prompts;
            }),
        )
    }

    addPrompt(insert: InsertPrompt) {
        return handleSqliteError(
                Effect.gen(function* () {
                yield* Effect.logDebug('Repository addPrompt - start');
                const prompt = yield* Effect.promise(() => db.insertInto('prompt').values(insert).returningAll().executeTakeFirstOrThrow());
                yield* Effect.logDebug('Repository addPrompt - end');
                return prompt;
            }),
        );
    }

    addTagsToPrompt(inserts: InsertPromptTag[]) {
        return handleSqliteError(
                Effect.gen(function* () {
                yield* Effect.logDebug('Repository addTagsToPrompt - start');
                yield* Effect.promise(() => db.insertInto('prompt_tag').values(inserts).execute());
                yield* Effect.logDebug('Repository addTagsToPrompt - end');
            }),
        );
    }

    removeTagFromPrompt(promptId: number, tagId: number) {
        return handleSqliteError(
                Effect.gen(function* () {
                yield* Effect.logDebug('Repository removeTagFromPrompt - start');
                yield* Effect.promise(() =>
                    db.deleteFrom('prompt_tag')
                        .where('prompt_id', '=', promptId)
                        .where('tag_id', '=', tagId)
                        .execute(),
                );
                yield* Effect.logDebug('Repository removeTagFromPrompt - end');
            })
        );
    }

    updatePrompt(updatePrompt: UpdatePrompt) {
        return handleSqliteError(
            Effect.gen(function* () {
                yield* Effect.logDebug('Repository updatePrompt - start');
                const prompt = yield* Effect.promise(() =>
                    db.updateTable('prompt')
                        .set(updatePrompt)
                        .where('id', '=', updatePrompt.id)
                        .returningAll()
                        .executeTakeFirstOrThrow(),
                );
                yield* Effect.logDebug('Repository updatePrompt - end');
                return prompt;
            }),
        );
    }

    removePromptById(id: number) {
        return handleSqliteError(
            Effect.gen(function* () {
                yield* Effect.logDebug('Repository removePromptById - start');
                yield* Effect.promise(() =>
                    db.deleteFrom('prompt').where('id', '=', id).execute(),
                );
                yield* Effect.logDebug('Repository removePromptById - end');
            }),
        );
    }
}

export const promptRepository = new PromptRepository();