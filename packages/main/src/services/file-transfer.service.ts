import fs from 'node:fs/promises';
import path from 'node:path';
import { Effect } from 'effect';
import { app, dialog } from 'electron';
import { PromptExportException } from '../common/exceptions/prompt/prompt-export.exception.js';
import { PromptImportException } from '../common/exceptions/prompt/prompt-import.exception.js';
import { UnexpectedException } from '../common/exceptions/unexpected.exception.js';
import { windowService } from '../modules/MainWindow.js';
import { PromptSerializer, isSquirrelObject } from '../utils/file-transfer.util.js';
import { promptService } from './prompt.service.js';

interface IFileTransferService {
    exportPrompts(options: ExportOptions): Effect.Effect<void, PromptExportException>;
    importPrompts(): Effect.Effect<void, PromptImportException>;
}

class FileTransferService implements IFileTransferService {
    exportPrompts({ prompts, type = 'squirrel', fileName = 'export-prompts.json' }: ExportOptions) {
        return Effect.gen(function* () {
            const defaultPath = path.join(app.getPath('exe'), fileName);

            const result = yield* Effect.tryPromise(() =>
                dialog.showSaveDialog(windowService.getMainWindow(), {
                    title: '프롬프트 내보내기',
                    defaultPath,
                    buttonLabel: '내보내기',
                    filters: [{ name: 'JSON 파일', extensions: ['json'] }],
                }),
            );

            if (result.canceled || !result.filePath) return;

            const filePath = result.filePath;
            const serializer = new PromptSerializer();
            const content = serializer.serialize(prompts, type);

            yield* Effect.tryPromise({
                try: () => fs.writeFile(filePath, content, 'utf-8'),
                catch: (error) => PromptExportException.from(error),
            });

            return;
        }).pipe(Effect.catchAll((error) => Effect.fail(UnexpectedException.from(error))));
    }

    importPrompts() {
        return Effect.gen(function* () {
            const result = yield* Effect.tryPromise(() =>
                dialog.showOpenDialog(windowService.getMainWindow(), {
                    title: '프롬프트 가져오기',
                    buttonLabel: '가져오기',
                    properties: ['openFile'],
                    filters: [{ name: 'JSON 파일', extensions: ['json'] }],
                }),
            );

            if (result.canceled || !result.filePaths.length) return;

            const filePath = result.filePaths[0];
            const content = yield* Effect.tryPromise({
                try: () => fs.readFile(filePath, 'utf-8'),
                catch: (error) => PromptExportException.from(error),
            });

            const JSONObject = JSON.parse(content);
            Effect.logDebug('Importing prompts from file', { filePath, content: JSONObject });

            const squirrelObjects = JSON.parse(content);
            if (!Array.isArray(squirrelObjects))
                throw new PromptImportException(
                    'Invalid file format: Expected an array of prompts.',
                );
            if (squirrelObjects.length === 0)
                throw new PromptImportException('No prompts found in the file.');
            if (!squirrelObjects.every((o) => isSquirrelObject(o)))
                throw new PromptImportException(
                    'Invalid file format: Not all objects are valid Squirrel objects.',
                );

            return yield* promptService.addPromptsIfNotExists(squirrelObjects);
        }).pipe(Effect.catchAll((error) => Effect.fail(PromptImportException.from(error))));
    }
}

export const fileTransferService = new FileTransferService();
