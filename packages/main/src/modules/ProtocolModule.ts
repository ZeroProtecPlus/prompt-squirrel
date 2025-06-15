import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { net, protocol } from 'electron';
import { AppModule } from '../AppModule.js';
import { ModuleContext } from '../ModuleContext.js';

class ProtocolModule implements AppModule {
    async enable({ app }: ModuleContext) {
        protocol.registerSchemesAsPrivileged([
            {
                scheme: 'thumbnail',
                privileges: {
                    standard: true,
                },
            },
        ]);
        await app.whenReady();

        if (!fs.existsSync(path.join(app.getPath('userData'), 'thumbnails')))
            fs.mkdirSync(path.join(app.getPath('userData'), 'thumbnails'), { recursive: true });

        function handleProtocolRequest(request: Request) {
            const url = new URL(request.url);

            const filePath = path.join(app.getPath('userData'), 'thumbnails', url.hostname);
            if (fs.existsSync(filePath))
                return net.fetch(pathToFileURL(filePath).toString(), {
                    headers: {
                        'content-type': 'image/*',
                    },
                });

            return new Response('NOT FOUND', {
                status: 404,
            });
        }

        protocol.handle('thumbnail', handleProtocolRequest);
    }
}

export function protocolModule(): ProtocolModule {
    return new ProtocolModule();
}
