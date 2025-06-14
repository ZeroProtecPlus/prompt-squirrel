import Store from 'electron-store';
import { Ok } from '../common/ipc.response.js';
import { storeConfig } from '../config/constants.js';

class ConfigController implements IConfigController {
    constructor(private readonly store: Store<AppConfig>) {}

    async get(key: keyof AppConfig): Promise<IPCResponse<AppConfig[keyof AppConfig]>> {
        const value = this.store.get(key);
        return Ok(value);
    }

    async set(key: keyof AppConfig, value: AppConfig[keyof AppConfig]): Promise<IPCResponse<void>> {
        this.store.set(key, value);
        return Ok();
    }

    async getAll(): Promise<IPCResponse<AppConfig>> {
        const allConfig = this.store.store;
        return Ok(allConfig);
    }
}

export const configController: IConfigController = new ConfigController(
    new Store<AppConfig>(storeConfig),
);
