import { Effect } from 'effect';
import { DatabaseException } from '../common/exceptions/database.exception.js';
import { handleSqliteError } from '../common/exceptions/sqlite-error.handler.js';
import { db } from '../database/db.js';
import { SelectTag } from '../database/table/tag.js';

interface ITagRepository {
    getAllTags(): Effect.Effect<SelectTag[], DatabaseException>;
    getTagsByPromptId(promptId: number): Effect.Effect<SelectTag[], DatabaseException>;
    addTag(insert: { name: string }): Effect.Effect<SelectTag, DatabaseException>;
    removeTagByName(name: string): Effect.Effect<void, DatabaseException>;
}

class TagRepository implements ITagRepository {
    getAllTags() {
        return handleSqliteError(
            Effect.gen(function* () {
                yield* Effect.logDebug('Repository getAllTags - before');
                const tags = yield* Effect.promise(() =>
                    db.selectFrom('tag').selectAll().execute(),
                );
                yield* Effect.logDebug('Repository getAllTags - after');
                return tags;
            }),
        );
    }

    getTagsByPromptId(promptId: number) {
        return handleSqliteError(
            Effect.gen(function* () {
                yield* Effect.logDebug('Repository getTagsByPromptId - before');
                const tags = yield* Effect.promise(() =>
                    db
                        .selectFrom('tag')
                        .innerJoin('prompt_tag', 'tag.id', 'prompt_tag.tag_id')
                        .where('prompt_tag.prompt_id', '=', promptId)
                        .selectAll()
                        .execute(),
                );
                yield* Effect.logDebug('Repository getTagsByPromptId - after');
                return tags;
            }),
        );
    }

    addTag(insert: { name: string }) {
        return handleSqliteError(
            Effect.gen(function* () {
                yield* Effect.logDebug('Repository addTag - before');
                const tag = yield* Effect.promise(() =>
                    db.insertInto('tag').values(insert).returningAll().executeTakeFirstOrThrow(),
                );
                yield* Effect.logDebug('Repository addTag - after');
                return tag;
            }),
        );
    }

    removeTagByName(name: string) {
        return handleSqliteError(
            Effect.gen(function* () {
                yield* Effect.logDebug('Repository removeTagByName - before');
                yield* Effect.promise(() =>
                    db.deleteFrom('tag').where('name', '=', name).execute(),
                );
                yield* Effect.logDebug('Repository removeTagByName - after');
            }),
        );
    }
}

export const tagRepository = new TagRepository();
