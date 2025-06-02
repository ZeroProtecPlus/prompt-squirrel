import { ipcMain } from 'electron';
import { AppModule } from '../AppModule.js';
import { categoryController } from '../controller/category.controller.js';

class IPCModule implements AppModule {
    enable(): Promise<void> | void {
        registerIpc('category', categoryController);
    }
}

function registerIpc<T extends object>(channel: IPCChannels, controller: T) {
    const prototype = Reflect.getPrototypeOf(controller);
    if (!prototype)
        throw new Error(`Controller for IPC channel "${channel}" does not have a prototype.`);

    const methods = Reflect.ownKeys(prototype).filter(
        (name): name is string & keyof T =>
            // biome-ignore lint/suspicious/noExplicitAny: 유틸 함수로서 any를 사용합니다.
            name !== 'constructor' && typeof (controller as any)[name] === 'function',
    );
    console.log(`Registering IPC channels for ${channel}:`, methods);

    for (const methodName of methods) {
        const ipcChannelName = `${channel}:${methodName}`;
        console.log(`  - Registering ${ipcChannelName}`);
        ipcMain.handle(ipcChannelName, (...args: unknown[]) =>
            // biome-ignore lint/suspicious/noExplicitAny: 유틸 함수로서 any를 사용합니다.
            (controller as any)[methodName](...args),
        );
    }
}

export function ipcModule(): IPCModule {
    return new IPCModule();
}
