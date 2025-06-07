import { Effect } from "effect";
import { Err, Ok } from "../common/ipc.response.js";
import { runWithLogger } from "../common/utils.js";
import { tagService } from "../services/tag.service.js";

class TagController implements ITagController {
    private readonly PREFIX = '[Tag]';

    async getAllTags(): Promise<IPCResponse<TagDto[]>> {
        return runWithLogger(
            Effect.gen(function* () {
                yield* Effect.logDebug("getAllTags - start");
                const tags = yield* tagService.getAllTags();
                yield* Effect.logDebug("getAllTags - end", { length: tags.length });
                return Ok(tags);
            }),
            this.PREFIX,
        )
    }

    async addTag(name: string): Promise<IPCResponse<TagDto>> {
        return runWithLogger(
            Effect.gen(function* () {
                yield* Effect.logDebug("addTag", { name });
                const tag = yield* tagService.addTag(name);
                yield* Effect.logDebug("addTag - end", { tag });
                return Ok(tag);
            }),
            this.PREFIX,
        )
    }

    async removeTagByName(name: string): Promise<IPCResponse<void>> {
        return runWithLogger(
            Effect.gen(function* () {
                yield* Effect.logDebug("removeTagByName", { name });
                yield* tagService.removeTagByName(name);
                yield* Effect.logDebug("removeTagByName - end");
                return Ok();
            }),
            this.PREFIX,
        )
    }
}

export const tagController = new TagController();