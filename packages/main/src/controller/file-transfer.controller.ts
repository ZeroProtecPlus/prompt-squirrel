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

    previewImport(): Promise<IPCResponse<ImportPreviewResult>> {
        return runWithLogger(
            Effect.gen(function* () {
                yield* Effect.logDebug('Previewing import');
                const previewResult = yield* fileTransferService.previewImport();
                yield* Effect.logDebug('Import preview completed');
                return Ok(previewResult);
            }),
            'Previewing import',
        );
    }

    importPromptsWithStrategy(options: ImportOptions): Promise<IPCResponse<PromptDto[]>> {
        return runWithLogger(
            Effect.gen(function* () {
                yield* Effect.logDebug('Importing prompts with strategy', options);
                const importedPrompts = yield* fileTransferService.importPromptsWithStrategy(options);
                yield* Effect.logDebug('Prompts imported with strategy successfully');
                return Ok(importedPrompts);
            }),
            'Importing prompts with strategy',
        );
    }
}

export const fileTransferController = new FileTransferController();
