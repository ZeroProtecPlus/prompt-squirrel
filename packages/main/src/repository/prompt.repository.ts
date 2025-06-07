import { Effect } from 'effect';
import { DatabaseException } from '../common/exceptions/database.exception.js';
import { db } from '../database/db.js';
import { InsertPrompt, PromptTable, SelectPrompt, UpdatePrompt } from '../database/table/prompt.js';
import { InsertPromptTag } from '../database/table/tag-prompt.js';

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
        return Effect.gen(function* () {
            yield* Effect.logDebug('Repository getAllPrompts - start');
            const prompts = yield* Effect.tryPromise({
                try: () =>
                    db
                        .selectFrom('prompt')
                        .selectAll()
                        .orderBy('id', 'desc')
                        .orderBy('name', 'asc')
                        .execute(),
                catch: (error) => DatabaseException.from(error),
            });
            yield* Effect.logDebug('Repository getAllPrompts - end');
            return prompts;
        });
    }

    addPrompt(insert: InsertPrompt) {
        return Effect.gen(function* () {
            yield* Effect.logDebug('Repository addPrompt - start');
            const prompt = yield* Effect.tryPromise({
                try: () =>
                    db.insertInto('prompt').values(insert).returningAll().executeTakeFirstOrThrow(),
                catch: (error) => DatabaseException.from(error),
            });
            yield* Effect.logDebug('Repository addPrompt - end');
            return prompt;
        });
    }

    addTagsToPrompt(inserts: InsertPromptTag[]) {
        return Effect.gen(function* () {
            yield* Effect.logDebug('Repository addTagsToPrompt - start');
            yield* Effect.tryPromise({
                try: () => db.insertInto('prompt_tag').values(inserts).execute(),
                catch: (error) => DatabaseException.from(error),
            });
            yield* Effect.logDebug('Repository addTagsToPrompt - end');
        });
    }

    removeTagFromPrompt(promptId: number, tagId: number) {
        return Effect.gen(function* () {
            yield* Effect.logDebug('Repository removeTagFromPrompt - start');
            yield* Effect.tryPromise({
                try: () =>
                    db
                        .deleteFrom('prompt_tag')
                        .where('prompt_id', '=', promptId)
                        .where('tag_id', '=', tagId)
                        .execute(),
                catch: (error) => DatabaseException.from(error),
            });
            yield* Effect.logDebug('Repository removeTagFromPrompt - end');
        });
    }

    updatePrompt(updatePrompt: UpdatePrompt) {
        return Effect.gen(function* () {
            yield* Effect.logDebug('Repository updatePrompt - start');
            const prompt = yield* Effect.tryPromise({
                try: () =>
                    db
                        .updateTable('prompt')
                        .set({
                            name: updatePrompt.name,
                            prompt: updatePrompt.prompt,
                            category_id: updatePrompt.category_id,
                        })
                        .where('id', '=', updatePrompt.id)
                        .returningAll()
                        .executeTakeFirstOrThrow(),
                catch: (error) => DatabaseException.from(error),
            });
            yield* Effect.logDebug('Repository updatePrompt - end');
            return prompt;
        });
    }

    removePromptById(id: number) {
        return Effect.gen(function* () {
            yield* Effect.logDebug('Repository removePromptById - start');
            yield* Effect.tryPromise({
                try: () => db.deleteFrom('prompt').where('id', '=', id).execute(),
                catch: (error) => DatabaseException.from(error),
            });
            yield* Effect.logDebug('Repository removePromptById - end');
        });
    }
}

export const promptRepository = new PromptRepository();
