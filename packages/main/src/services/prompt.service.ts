import { Effect } from 'effect';
import { ServiceException } from '../common/exceptions/base/service.exception.js';
import { promptExceptionHandler } from '../common/exceptions/handlers/prompt-exception.handler.js';
import {
    squirrelObjectToInsertPrompt,
    toInsertPrompt,
    toInsertPromptTag,
    toPromptDto,
    toUpdatePrompt,
} from '../mapper/prompt.mapper.js';
import { promptRepository } from '../repository/prompt.repository.js';
import { randomId } from '../utils/gen.js';
import { categoryService } from './category.service.js';
import { tagService } from './tag.service.js';

interface IPromptService {
    getAllPrompts(): Effect.Effect<PromptDto[], ServiceException>;
    addPrompt(createPromptDto: CreatePromptDto): Effect.Effect<PromptDto, ServiceException>;
    addPromptsIfNotExists(
        SquirrelObjects: SquirrelObject[],
    ): Effect.Effect<PromptDto[], ServiceException>;
    updatePrompt(updatePromptDto: UpdatePromptDto): Effect.Effect<PromptDto, ServiceException>;
    addTagToPrompt(
        addTagToPromptDto: AddTagToPromptDto,
    ): Effect.Effect<PromptDto, ServiceException>;
    removeTagFromPrompt(
        removeTagFromPromptDto: RemoveTagFromPromptDto,
    ): Effect.Effect<PromptDto, ServiceException>;
    removePromptById(id: number): Effect.Effect<void, ServiceException>;
}

class PromptService implements IPromptService {
    getAllPrompts() {
        return promptExceptionHandler(
            Effect.gen(function* () {
                yield* Effect.logDebug('Service: getAllPrompts - start');
                const prompts = yield* promptRepository.getAllPrompts();

                const dtos: PromptDto[] = [];

                for (const prompt of prompts) {
                    const tagIds = yield* tagService.getTagsByPromptId(prompt.id);
                    dtos.push(
                        toPromptDto(
                            prompt,
                            tagIds.map((tag) => tag.id),
                        ),
                    );
                }
                yield* Effect.logDebug('Service: getAllPrompts - end');
                return dtos;
            }),
        );
    }

    addPrompt(createPromptDto: CreatePromptDto): Effect.Effect<PromptDto, ServiceException> {
        return promptExceptionHandler(
            Effect.gen(function* () {
                yield* Effect.logDebug('Service: addPrompt - start', { createPromptDto });
                const prompt = yield* promptRepository.addPrompt(toInsertPrompt(createPromptDto));

                if (createPromptDto.tags.length !== 0) {
                    const inserts = createPromptDto.tags.map((tag) =>
                        toInsertPromptTag(prompt.id, tag.id),
                    );
                    yield* promptRepository.addTagsToPrompt(inserts);
                }
                const tags = yield* tagService.getTagsByPromptId(prompt.id);
                yield* Effect.logDebug('Service: addPrompt - end', { prompt });
                return toPromptDto(
                    prompt,
                    tags.map((tag) => tag.id),
                );
            }),
        );
    }

    addPromptsIfNotExists(
        SquirrelObjects: SquirrelObject[],
    ): Effect.Effect<PromptDto[], ServiceException> {
        return promptExceptionHandler(
            Effect.gen(function* () {
                yield* Effect.logDebug('Service: addPromptsIfNotExists - start', {
                    SquirrelObjects,
                });
                const identity = randomId();
                const newPrompts: PromptDto[] = [];

                for (const squirrelObject of SquirrelObjects) {
                    const category: Category | null = squirrelObject.category
                        ? yield* categoryService.addCategoryIfNotExists(squirrelObject.category)
                        : null;
                    const tags =
                        squirrelObject.tags.length !== 0
                            ? yield* tagService.addTagsIfNotExists(squirrelObject.tags)
                            : [];

                    const existingPrompt = yield* promptRepository.findByName(squirrelObject.name);
                    if (existingPrompt) squirrelObject.name = `${squirrelObject.name} ${identity}`;

                    const prompt = yield* promptRepository.addPrompt(
                        squirrelObjectToInsertPrompt(squirrelObject, category),
                    );

                    if (tags.length !== 0) {
                        const inserts = tags.map((tag) => toInsertPromptTag(prompt.id, tag.id));
                        yield* promptRepository.addTagsToPrompt(inserts);
                    }

                    newPrompts.push(
                        toPromptDto(
                            prompt,
                            tags.map((tag) => tag.id),
                        ),
                    );
                }
                yield* Effect.logDebug('Service: addPromptsIfNotExists - end');
                return newPrompts;
            }),
        );
    }

    updatePrompt(updatePromptDto: UpdatePromptDto): Effect.Effect<PromptDto, ServiceException> {
        return promptExceptionHandler(
            Effect.gen(function* () {
                yield* Effect.logDebug('Service: updatePrompt - start', { updatePromptDto });
                const update = toUpdatePrompt(updatePromptDto);
                const prompt = yield* promptRepository.updatePrompt(update);
                const tagIds = yield* tagService.getTagsByPromptId(prompt.id);
                yield* Effect.logDebug('Service: updatePrompt - end', { prompt });
                return toPromptDto(
                    prompt,
                    tagIds.map((tag) => tag.id),
                );
            }),
        );
    }

    addTagToPrompt(
        addTagToPromptDto: AddTagToPromptDto,
    ): Effect.Effect<PromptDto, ServiceException> {
        return promptExceptionHandler(
            Effect.gen(function* () {
                yield* Effect.logDebug('Service: addTagToPrompt - start', { addTagToPromptDto });
                yield* promptRepository.addTagsToPrompt([
                    toInsertPromptTag(addTagToPromptDto.promptId, addTagToPromptDto.tagId),
                ]);
                const prompt = yield* promptRepository.findById(addTagToPromptDto.promptId);
                const tagIds = yield* tagService.getTagsByPromptId(prompt.id);
                yield* Effect.logDebug('Service: addTagToPrompt - end');
                return toPromptDto(
                    prompt,
                    tagIds.map((tag) => tag.id),
                );
            }),
        );
    }

    removeTagFromPrompt(
        removeTagFromPromptDto: RemoveTagFromPromptDto,
    ): Effect.Effect<PromptDto, ServiceException> {
        return promptExceptionHandler(
            Effect.gen(function* () {
                yield* Effect.logDebug('Service: removeTagFromPrompt - start', {
                    removeTagFromPromptDto,
                });
                yield* promptRepository.removeTagFromPrompt(
                    removeTagFromPromptDto.promptId,
                    removeTagFromPromptDto.tagId,
                );
                const prompt = yield* promptRepository.findById(removeTagFromPromptDto.promptId);
                const tagIds = yield* tagService.getTagsByPromptId(prompt.id);
                yield* Effect.logDebug('Service: removeTagFromPrompt - end');
                return toPromptDto(
                    prompt,
                    tagIds.map((tag) => tag.id),
                );
            }),
        );
    }

    removePromptById(id: number): Effect.Effect<void, ServiceException> {
        return promptExceptionHandler(
            Effect.gen(function* () {
                yield* Effect.logDebug('Service: removePromptById start', { id });
                yield* promptRepository.removePromptById(id);
                yield* Effect.logDebug('Service: removePromptById end');
            }),
        );
    }
}

export const promptService = new PromptService();
