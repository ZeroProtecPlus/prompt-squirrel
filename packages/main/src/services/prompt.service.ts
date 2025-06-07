import { Effect } from "effect";
import { ServiceException } from "../common/exceptions/service.exception.js";
import { promptRepository } from "../repository/prompt.repository.js";
import { tagService } from "./tag.service.js";
import { toInsertPrompt, toInsertPromptTag, toPromptDto, toUpdatePrompt } from "../mapper/prompt.mapper.js";

class PromptService {
    getAllPrompts(): Effect.Effect<PromptDto[], ServiceException> {
        return Effect.gen(function* () {
            yield* Effect.log("Service: getAllPrompts");
            const prompts = yield* promptRepository.getAllPrompts();

            const dtos: PromptDto[] = [];

            for (const prompt of prompts) {
                const tagIds = yield* tagService.getTagIdsByPromptId(prompt.id);
                dtos.push(toPromptDto(prompt, tagIds.map((tag) => tag.id)));
            }

            return dtos.toSorted((a, b) => a.name.localeCompare(b.name));
        }).pipe(
            Effect.catchAll((error) => Effect.fail(ServiceException.from(error))),
        );
    }

    addPrompt(createPromptDto: CreatePromptDto): Effect.Effect<PromptDto, ServiceException> {
        return Effect.gen(function* () {
            yield* Effect.log("Service: addPrompt", { createPromptDto });
            const prompt = yield* promptRepository.addPrompt(toInsertPrompt(createPromptDto));

            if (createPromptDto.tags.length !== 0)
                yield* promptRepository.addTagsToPrompt(createPromptDto.tags.map((tag) => toInsertPromptTag(prompt.id, tag.id)));
            const tags = yield* tagService.getTagIdsByPromptId(prompt.id);

            return toPromptDto(prompt, tags.map((tag) => tag.id));
        }).pipe(
            Effect.catchAll((error) => Effect.fail(ServiceException.from(error))),
        );
    }

    updatePrompt(updatePromptDto: UpdatePromptDto): Effect.Effect<PromptDto, ServiceException> {
        return Effect.gen(function* () {
            yield* Effect.log("Service: updatePrompt", { updatePromptDto });
            const update = toUpdatePrompt(updatePromptDto);
            const prompt = yield* promptRepository.updatePrompt(update);
            const tagIds = yield* tagService.getTagIdsByPromptId(prompt.id);
            return toPromptDto(prompt, tagIds.map((tag) => tag.id));
        }).pipe(
            Effect.catchAll((error) => Effect.fail(ServiceException.from(error))),
        );
    }

    addTagToPrompt(addTagToPromptDto: AddTagToPromptDto): Effect.Effect<void, ServiceException> {
        return Effect.gen(function* () {
            yield* Effect.log("Service: addTagToPrompt", { addTagToPromptDto });
            yield* promptRepository.addTagsToPrompt([toInsertPromptTag(addTagToPromptDto.promptId, addTagToPromptDto.tagId)]);
        }).pipe(
            Effect.catchAll((error) => Effect.fail(ServiceException.from(error))),
        );
    }

    removeTagFromPrompt(removeTagFromPromptDto: RemoveTagFromPromptDto): Effect.Effect<void, ServiceException> {
        return Effect.gen(function* () {
            yield* Effect.log("Service: removeTagFromPrompt", { removeTagFromPromptDto });
            yield* promptRepository.removeTagFromPrompt(removeTagFromPromptDto.promptId, removeTagFromPromptDto.tagId);
        }).pipe(
            Effect.catchAll((error) => Effect.fail(ServiceException.from(error))),
        );
    }

    removePromptById(id: number): Effect.Effect<void, ServiceException> {
        return Effect.gen(function* () {
            yield* Effect.log("Service: removePromptById", { id });
            yield* promptRepository.removePromptById(id);
        }).pipe(
            Effect.catchAll((error) => Effect.fail(ServiceException.from(error))),
        );
    }
}

export const promptService = new PromptService();