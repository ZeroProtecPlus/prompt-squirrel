import { SqliteError } from "better-sqlite3";
import { Effect } from "effect";
import { db } from "../database/db.js";
import { InsertPrompt, PromptTable, SelectPrompt } from "../database/table/prompt.js";

class PromptRepository {
    getAllPrompts(): Effect.Effect<SelectPrompt[], SqliteError> {
        return Effect.promise(() => db.selectFrom('prompt').selectAll().execute()).pipe(
            Effect.tap((prompts) =>
                Effect.log(`Repository getAllPrompts Length : ${prompts.length}`),
            ),
        );
    }

    addPrompt(insert: InsertPrompt): Effect.Effect<SelectPrompt, SqliteError> {
        return Effect.promise(() =>
            db.insertInto('prompt').values(insert).returningAll().executeTakeFirstOrThrow(),
        ).pipe(Effect.tap((prompt) => Effect.log('Repository addPrompt:', prompt)));
    }

    addTagsToPrompt(promptId: number, tagIds: number[]): Effect.Effect<void, SqliteError> {
        return Effect.promise(() =>
            db.insertInto('prompt_tag')
                .values(tagIds.map(tagId => ({ prompt_id: promptId, tag_id: tagId })))
                .execute(),
        ).pipe(Effect.tap(() => Effect.log('Repository addTagsToPrompt:', { promptId, tagIds })));
    }

    removePromptById(id: number): Effect.Effect<void, SqliteError> {
        return Effect.promise(() =>
            db.deleteFrom('prompt').where('id', '=', id).execute(),
        ).pipe(Effect.tap(() => Effect.log('Repository removePromptByName:', name)));
    }
}

export const promptRepository = new PromptRepository();