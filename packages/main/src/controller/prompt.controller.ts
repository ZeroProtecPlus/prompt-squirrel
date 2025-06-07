import { Effect } from "effect";
import { Err, Ok } from "../common/ipc.response.js";
import { runWithLogger } from "../common/utils.js";
import { promptService } from "../services/prompt.service.js";

class PromptController implements IPromptController {
    private readonly PREFIX = '[Prompt]';

    getAllPrompts() {
        return runWithLogger(
            Effect.gen(function* () {
                yield* Effect.log("getAllPrompts - start");
                const prompts = yield* promptService.getAllPrompts();
                yield* Effect.log("getAllPrompts - end", { length: prompts.length });
                return Ok(prompts);
            }).pipe(
                Effect.catchAll((error) => Effect.succeed(Err(error))),
            ),
            this.PREFIX,
        )
    }

    addPrompt(createPromptDto: CreatePromptDto): Promise<IPCResponse<PromptDto>> {
        return runWithLogger(
            Effect.gen(function* () {
                yield* Effect.log("addPrompt - start", { createPromptDto });
                const prompt = yield* promptService.addPrompt(createPromptDto);
                yield* Effect.log("addPrompt - end", { prompt });
                return Ok(prompt);
            }).pipe(
                Effect.catchAll((error) => Effect.succeed(Err(error))),
            ),
            this.PREFIX,
        );
    }

    updatePrompt(updatePromptDto: UpdatePromptDto): Promise<IPCResponse<PromptDto>> {
        return runWithLogger(
            Effect.gen(function* () {
                yield* Effect.log("updatePrompt - start", { updatePromptDto });
                const prompt = yield* promptService.updatePrompt(updatePromptDto);
                yield* Effect.log("updatePrompt - end", { prompt });
                return Ok(prompt);
            }).pipe(
                Effect.catchAll((error) => Effect.succeed(Err(error))),
            ),
            this.PREFIX,
        );
    }

    addTagToPrompt(addTagToPromptDto: AddTagToPromptDto): Promise<IPCResponse<void>> {
        return runWithLogger(
            Effect.gen(function* () {
                yield* Effect.log("addTagToPrompt - start", { addTagToPromptDto });
                yield* promptService.addTagToPrompt(addTagToPromptDto);
                yield* Effect.log("addTagToPrompt - end", { addTagToPromptDto });
                return Ok();
            }).pipe(
                Effect.catchAll((error) => Effect.succeed(Err(error))),
            ),
            this.PREFIX,
        );
    }

    removeTagFromPrompt(removeTagFromPromptDto: RemoveTagFromPromptDto): Promise<IPCResponse<void>> {
        return runWithLogger(
            Effect.gen(function* () {
                yield* Effect.log("removeTagFromPrompt - start", { removeTagFromPromptDto });
                yield* promptService.removeTagFromPrompt(removeTagFromPromptDto);
                yield* Effect.log("removeTagFromPrompt - end", { removeTagFromPromptDto });
                return Ok();
            }).pipe(
                Effect.catchAll((error) => Effect.succeed(Err(error))),
            ),
            this.PREFIX,
        );
    }

    removePromptById(id: number): Promise<IPCResponse<void>> {
        return runWithLogger(
            Effect.gen(function* () {
                yield* Effect.log("removePromptById - start", { id });
                yield* promptService.removePromptById(id);
                yield* Effect.log("removePromptById - end", { id });
                return Ok();
            }).pipe(
                Effect.catchAll((error) => Effect.succeed(Err(error))),
            ),
            this.PREFIX,
        );
    }
}

export const promptController = new PromptController();