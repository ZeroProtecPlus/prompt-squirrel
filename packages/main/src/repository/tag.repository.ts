import { SqliteError } from "better-sqlite3";
import { Effect } from "effect";
import { db } from "../database/db.js";
import { SelectTag } from "../database/table/tag.js";

export class TagRepository {
    getAllTags(): Effect.Effect<SelectTag[], SqliteError> {
        return Effect.promise(() => db.selectFrom('tag').selectAll().execute()).pipe(
            Effect.tap((tags) =>
                Effect.log(`Repository getAllTags Length : ${tags.length}`),
            ),
        );
    }

    addTag(insert: { name: string }): Effect.Effect<SelectTag, SqliteError> {
        return Effect.promise(() =>
            db.insertInto('tag').values(insert).returningAll().executeTakeFirstOrThrow(),
        ).pipe(Effect.tap((tag) => Effect.log('Repository addTag:', tag)));
    }

    removeTagByName(name: string): Effect.Effect<void, SqliteError> {
        return Effect.promise(() =>
            db.deleteFrom('tag').where('name', '=', name).execute(),
        ).pipe(Effect.tap(() => Effect.log('Repository removeTagByName:', name)));
    }
}