import { Effect } from "effect";
import { ServiceException } from "../common/exceptions/service.exception.js";
import { promptRepository } from "../repository/prompt.repository.js";
import { tagService } from "./tag.service.js";
import { toInsertPrompt, toPromptDto } from "../mapper/prompt.mapper.js";

class PromptService {
    getAllPrompts(): Effect.Effect<PromptDto[], ServiceException> {
        return Effect.gen(function* () {
            const prompts = yield* promptRepository.getAllPrompts();
            Effect.log("Service: getAllPrompts", { length: prompts.length });

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
            const insert = toInsertPrompt(createPromptDto);
            yield* Effect.log("Service: addPrompt - Insert", { insert });
            const prompt = yield* promptRepository.addPrompt(insert);
            if (createPromptDto.tags.length !== 0)
                yield* promptRepository.addTagsToPrompt(prompt.id, createPromptDto.tags.map((tag) => tag.id));

            const tagIds = yield* tagService.getTagIdsByPromptId(prompt.id);
            return toPromptDto(prompt, tagIds.map((tag) => tag.id));
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