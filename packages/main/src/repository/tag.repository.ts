import { Effect } from 'effect';
import { DatabaseException } from '../common/exceptions/database.exception.js';
import { db } from '../database/db.js';
import { InsertTag, SelectTag } from '../database/table/tag.js';

interface ITagRepository {
    getAllTags(): Effect.Effect<SelectTag[], DatabaseException>;
    getTagsByPromptId(promptId: number): Effect.Effect<SelectTag[], DatabaseException>;
    addTag(insert: { name: string }): Effect.Effect<SelectTag, DatabaseException>;
    addTagsIfNotExists(tags: string[]): Effect.Effect<SelectTag[], DatabaseException>;
    removeTagByName(name: string): Effect.Effect<void, DatabaseException>;
}

class TagRepository implements ITagRepository {
    getAllTags() {
        return Effect.gen(function* () {
            yield* Effect.logDebug('Repository getAllTags - before');
            const tags = yield* Effect.tryPromise({
                try: () => db.selectFrom('tag').selectAll().orderBy('name', 'asc').execute(),
                catch: (error) => DatabaseException.from(error),
            });
            yield* Effect.logDebug('Repository getAllTags - after');
            return tags;
        });
    }

    getTagsByPromptId(promptId: number) {
        return Effect.gen(function* () {
            yield* Effect.logDebug('Repository getTagsByPromptId - before');
            const tags = yield* Effect.tryPromise({
                try: () =>
                    db
                        .selectFrom('tag')
                        .innerJoin('prompt_tag', 'tag.id', 'prompt_tag.tag_id')
                        .where('prompt_tag.prompt_id', '=', promptId)
                        .selectAll()
                        .execute(),
                catch: (error) => DatabaseException.from(error),
            });
            yield* Effect.logDebug('Repository getTagsByPromptId - after');
            return tags;
        });
    }

    addTag(insert: InsertTag) {
        return Effect.gen(function* () {
            yield* Effect.logDebug('Repository addTag - before');
            const tag = yield* Effect.tryPromise({
                try: () =>
                    db
                        .insertInto('tag')
                        .values({ name: insert.name })
                        .returningAll()
                        .executeTakeFirstOrThrow(),
                catch: (error) => DatabaseException.from(error),
            });
            yield* Effect.logDebug('Repository addTag - after');
            return tag;
        });
    }

    addTagsIfNotExists(tags: string[]): Effect.Effect<SelectTag[], DatabaseException> {
        return Effect.gen(function* () {
            yield* Effect.logDebug('Repository addTagsIfNotExists - start', { tags });
            if (tags.length === 0) return [];

            const result: SelectTag[] = [];

            const existsTags = yield* Effect.tryPromise({
                try: () => db.selectFrom('tag').selectAll().where('name', 'in', tags).execute(),
                catch: (error) => DatabaseException.from(error),
            });
            result.push(...existsTags);

            const toInserts = tags.filter(
                (tag) => !existsTags.some((existsTag) => existsTag.name === tag),
            );

            if (toInserts.length > 0) {
                const inserts = toInserts.map((tag) => ({ name: tag }));
                const insertedTags = yield* Effect.tryPromise({
                    try: () => db.insertInto('tag').values(inserts).returningAll().execute(),
                    catch: (error) => DatabaseException.from(error),
                });
                result.push(...insertedTags);
            }
            yield* Effect.logDebug('Repository addTagsIfNotExists - end', { result });
            return result;
        });
    }

    removeTagByName(name: string) {
        return Effect.gen(function* () {
            yield* Effect.logDebug('Repository removeTagByName - before');
            yield* Effect.tryPromise({
                try: () => db.deleteFrom('tag').where('name', '=', name).execute(),
                catch: (error) => DatabaseException.from(error),
            });
            yield* Effect.logDebug('Repository removeTagByName - after');
        });
    }
}

export const tagRepository = new TagRepository();
