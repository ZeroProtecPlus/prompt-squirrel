import { Effect } from 'effect';
import { ServiceException } from '../common/exceptions/base/service.exception.js';
import { TagDatabaseExceptionHandler } from '../common/exceptions/handlers/tag-exception.handler.js';
import { toTagDto } from '../mapper/tag.mapper.js';
import { tagRepository } from '../repository/tag.repository.js';

interface ITagService {
    getAllTags(): Effect.Effect<TagDto[], ServiceException>;
    getTagsByPromptId(promptId: number): Effect.Effect<TagDto[], ServiceException>;
    addTag(name: string): Effect.Effect<TagDto, ServiceException>;
    removeTagByName(name: string): Effect.Effect<void, ServiceException>;
}

class TagService {
    getAllTags() {
        return TagDatabaseExceptionHandler(
            Effect.gen(function* () {
                yield* Effect.logDebug('Service: getAllTags');
                const tags = yield* tagRepository.getAllTags();
                return tags.map(toTagDto).toSorted((a, b) => a.name.localeCompare(b.name));
            }),
        );
    }

    getTagsByPromptId(promptId: number) {
        return TagDatabaseExceptionHandler(
            Effect.gen(function* () {
                yield* Effect.logDebug('Service: getTagIdsByPromptId', { promptId });
                const tags = yield* tagRepository.getTagsByPromptId(promptId);
                return tags.map(toTagDto);
            }),
        );
    }

    addTag(name: string) {
        return TagDatabaseExceptionHandler(
            Effect.gen(function* () {
                yield* Effect.logDebug('Service: addTag', { name });
                const tag = yield* tagRepository.addTag({ name });
                return toTagDto(tag);
            }),
        );
    }

    addTagsIfNotExists(tags: string[]) {
        return TagDatabaseExceptionHandler(
            Effect.gen(function* () {
                yield* Effect.logDebug('Service: addTagsIfNotExists', { tags });
                const tagDtos = yield* tagRepository.addTagsIfNotExists(tags);
                return tagDtos.map(toTagDto);
            }),
        );
    }

    removeTagByName(name: string): Effect.Effect<void, ServiceException> {
        return TagDatabaseExceptionHandler(
            Effect.gen(function* () {
                yield* Effect.logDebug('Service: removeTagByName', { name });
                yield* tagRepository.removeTagByName(name);
                yield* Effect.logDebug('Service: removeTagByName - end', { name });
            }),
        );
    }
}

export const tagService = new TagService();
