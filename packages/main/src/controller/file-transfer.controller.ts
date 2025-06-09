import { Effect } from 'effect';
import { Ok } from '../common/ipc.response.js';
import { runWithLogger } from '../common/utils.js';
import { fileTransferService } from '../services/file-transfer.service.js';

class FileTransferController implements IFileTransferController {
    exportPrompts(options: ExportOptions): Promise<IPCResponse<void>> {
        return runWithLogger(
            Effect.gen(function* () {
                yield* Effect.logDebug('Exporting prompts', options);
                yield* fileTransferService.exportPrompts(options);
                yield* Effect.logDebug('Prompts exported successfully');
                return Ok();
            }),
            'Exporting prompts',
        );
    }

    importPrompts(): Promise<IPCResponse<PromptDto[]>> {
        return runWithLogger(
            Effect.gen(function* () {
                yield* Effect.logDebug('Importing prompts');
                const importedPrompts = yield* fileTransferService.importPrompts();
                yield* Effect.logDebug('Prompts imported successfully');
                return Ok(importedPrompts);
            }),
            'Importing prompts',
        );
    }
}

export const fileTransferController = new FileTransferController();
