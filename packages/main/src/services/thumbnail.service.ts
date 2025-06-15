import fs from 'node:fs';
import path from 'node:path';
import { Effect } from 'effect';
import { app } from 'electron';

interface IThumbnailService {
    saveThmumbnail(
        promptId: number,
        image: ThumbnailImage,
    ): Effect.Effect<string, ServiceException>;
}

const USER_THUMBNAIL_PATH = path.join(app.getPath('userData'), 'thumbnails');

class ThumbnailService implements IThumbnailService {
    saveThmumbnail(promptId: number, image: ThumbnailImage) {
        return Effect.gen(function* () {
            yield* Effect.logDebug('Service: saveThmumbnail - start', {
                promptId,
                image,
            });

            if (!fs.existsSync(USER_THUMBNAIL_PATH))
                fs.mkdirSync(USER_THUMBNAIL_PATH, { recursive: true });

            const ext = path.extname(image.name);

            const fileName = `${promptId}${ext}`;

            const filePath = path.join(USER_THUMBNAIL_PATH, fileName);

            fs.writeFileSync(filePath, Buffer.from(image.buffer));

            yield* Effect.logDebug('Service: saveThmumbnail - end', {
                fileName,
            });

            return fileName;
        });
    }

    deleteThumbnail(fileName: string) {
        return Effect.gen(function* () {
            yield* Effect.logDebug('Service: deleteThumbnail - start', { fileName });

            const filePath = path.join(USER_THUMBNAIL_PATH, fileName);

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                yield* Effect.logDebug('Service: deleteThumbnail - end', { fileName });
            } else {
                yield* Effect.logWarning('Service: deleteThumbnail - file not found', { fileName });
            }
        });
    }
}

export const thumbnailService = new ThumbnailService();
