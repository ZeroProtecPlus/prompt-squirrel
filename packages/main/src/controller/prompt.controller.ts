import { Effect } from 'effect';
import { Err, Ok } from '../common/ipc.response.js';
import { runWithLogger } from '../common/utils.js';
import { promptService } from '../services/prompt.service.js';

class PromptController implements IPromptController {
    private readonly PREFIX = '[Prompt]';

    getAllPrompts() {
        return runWithLogger(
            Effect.gen(function* () {
                yield* Effect.logDebug('getAllPrompts - start');
                const prompts = yield* promptService.getAllPrompts();
                yield* Effect.logDebug('getAllPrompts - end', { length: prompts.length });
                return Ok(prompts);
            }),
            this.PREFIX,
        );
    }

    addPrompt(createPromptDto: CreatePromptDto): Promise<IPCResponse<PromptDto>> {
        return runWithLogger(
            Effect.gen(function* () {
                yield* Effect.logDebug('addPrompt - start', { createPromptDto });
                const prompt = yield* promptService.addPrompt(createPromptDto);
                yield* Effect.logDebug('addPrompt - end', { prompt });
                return Ok(prompt);
            }),
            this.PREFIX,
        );
    }

    updatePrompt(updatePromptDto: UpdatePromptDto): Promise<IPCResponse<PromptDto>> {
        return runWithLogger(
            Effect.gen(function* () {
                yield* Effect.logDebug('updatePrompt - start', { updatePromptDto });
                const prompt = yield* promptService.updatePrompt(updatePromptDto);
                yield* Effect.logDebug('updatePrompt - end', { prompt });
                return Ok(prompt);
            }),
            this.PREFIX,
        );
    }

    addThumbnailToPrompt(
        addThumbnailToPromptDto: AddThumbnailToPromptDto,
    ): Promise<IPCResponse<PromptDto>> {
        return runWithLogger(
            Effect.gen(function* () {
                yield* Effect.logDebug('addThumbnailToPrompt - start', { addThumbnailToPromptDto });
                const updatedPrompt =
                    yield* promptService.addThumbnailToPrompt(addThumbnailToPromptDto);
                yield* Effect.logDebug('addThumbnailToPrompt - end', { updatedPrompt });
                return Ok(updatedPrompt);
            }),
            this.PREFIX,
        );
    }

    removeThumbnailFromPrompt(promptId: number): Promise<IPCResponse<PromptDto>> {
        return runWithLogger(
            Effect.gen(function* () {
                yield* Effect.logDebug('removeThumbnailFromPrompt - start', { promptId });
                const updatedPrompt = yield* promptService.removeThumbnailFromPrompt(promptId);
                yield* Effect.logDebug('removeThumbnailFromPrompt - end', { updatedPrompt });
                return Ok(updatedPrompt);
            }),
            this.PREFIX,
        );
    }

    addTagToPrompt(addTagToPromptDto: AddTagToPromptDto): Promise<IPCResponse<PromptDto>> {
        return runWithLogger(
            Effect.gen(function* () {
                yield* Effect.logDebug('addTagToPrompt - start', { addTagToPromptDto });
                const updatedPrompt = yield* promptService.addTagToPrompt(addTagToPromptDto);
                yield* Effect.logDebug('addTagToPrompt - end');
                return Ok(updatedPrompt);
            }),
            this.PREFIX,
        );
    }

    removeTagFromPrompt(
        removeTagFromPromptDto: RemoveTagFromPromptDto,
    ): Promise<IPCResponse<PromptDto>> {
        return runWithLogger(
            Effect.gen(function* () {
                yield* Effect.logDebug('removeTagFromPrompt - start', { removeTagFromPromptDto });
                const updatedPrompt =
                    yield* promptService.removeTagFromPrompt(removeTagFromPromptDto);
                yield* Effect.logDebug('removeTagFromPrompt - end', { removeTagFromPromptDto });
                return Ok(updatedPrompt);
            }),
            this.PREFIX,
        );
    }

    removePromptById(id: number): Promise<IPCResponse<void>> {
        return runWithLogger(
            Effect.gen(function* () {
                yield* Effect.logDebug('removePromptById - start', { id });
                yield* promptService.removePromptById(id);
                yield* Effect.logDebug('removePromptById - end', { id });
                return Ok();
            }).pipe(Effect.catchAll((error) => Effect.succeed(Err(error)))),
            this.PREFIX,
        );
    }
}

export const promptController = new PromptController();
