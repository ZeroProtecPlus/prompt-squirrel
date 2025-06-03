import { Effect } from "effect";
import { Err, Ok } from "../common/ipc.response.js";
import { runWithLogger } from "../common/utils.js";
import { tagService } from "../services/tag.service.js";

class TagController implements ITagController {
    private readonly PREFIX = '[Tag]';

    async getAllTags(): Promise<IPCResponse<TagDto[]>> {
        return runWithLogger(
            Effect.gen(function* () {
                Effect.log("getAllTags");
                const tags = yield* tagService.getAllTags();
                return Ok(tags);
            }).pipe(
                Effect.catchAll((error) => Effect.succeed(Err(error))),
            ),
            this.PREFIX,
        )
    }

    async addTag(name: string): Promise<IPCResponse<TagDto>> {
        return runWithLogger(
            tagService.addTag(name).pipe(
                Effect.tap(() => Effect.log("addTag", { name })),
                Effect.map((tag) => Ok(tag)),
                Effect.catchAll((error) => Effect.succeed(Err(error))),
            ),
            this.PREFIX,
        )
    }

    async removeTagByName(name: string): Promise<IPCResponse<void>> {
        return runWithLogger(
            tagService.removeTagByName(name).pipe(
                Effect.map(() => Ok()),
                Effect.catchAll((error) => Effect.succeed(Err(error))),
            ),
            this.PREFIX,
        )
    }
}

export const tagController = new TagController();