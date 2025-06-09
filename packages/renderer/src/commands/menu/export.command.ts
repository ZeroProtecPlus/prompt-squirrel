import { fileTransferApi } from '@app/preload';

export async function exportCommand(options: ExportOptions) {
    await fileTransferApi.exportPrompts(options);
}
