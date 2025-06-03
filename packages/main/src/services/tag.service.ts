import { Effect } from "effect";
import { TagRepository } from "../repository/tag.repository.js";
import { SqliteError } from "better-sqlite3";
import { ServiceException } from "../common/exceptions/service.exception.js";
import { toTagDto } from "../mapper/tag.mapper.js";

class TagService {
    private readonly tagRepository: TagRepository;
    constructor() {
        this.tagRepository = new TagRepository();
    }

    getAllTags(): Effect.Effect<TagDto[], ServiceException> {
        return this.tagRepository.getAllTags().pipe(
            Effect.tap(() => Effect.log("Service: getAllTags")),
            Effect.map((tags) => tags.map(toTagDto)),
            Effect.map((tags) => tags.toSorted((a, b) => a.name.localeCompare(b.name))),
            Effect.catchAll((error) => Effect.fail(ServiceException.from(error))),
        );
    }

    addTag(name: string): Effect.Effect<TagDto, ServiceException> {
        return this.tagRepository.addTag({ name }).pipe(
            Effect.tap(() => Effect.log("Service: addTag", { name })),
            Effect.map(toTagDto),
            Effect.catchAll((error: SqliteError) => {
                if (error instanceof SqliteError && error.code === "SQLITE_CONSTRAINT")
                    return Effect.fail(new ServiceException("Tag already exists", error));
                return Effect.fail(ServiceException.from(error));
            }),
        );
    }

    removeTagByName(name: string): Effect.Effect<void, ServiceException> {
        return this.tagRepository.removeTagByName(name).pipe(
            Effect.tap(() => Effect.log("Service: removeTagByName", { name })),
            Effect.catchAll((error) => Effect.fail(ServiceException.from(error))),
        );
    }
}

export const tagService = new TagService();