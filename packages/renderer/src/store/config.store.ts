import { configApi } from '@app/preload';
import { create } from 'zustand';

type ConfigState = {
    config: AppConfig;
};

type ConfigAction = {
    set(key: NestedPaths<AppConfig>, value: AppConfigValue): Promise<void>;
    isPromptType(type: PromptType): boolean;
    loadConfig: () => Promise<void>;
};

export const useConfigStore = create<ConfigState & ConfigAction>((set, get) => ({
    config: {
        promptType: 'local',
        removeUnderbar: false,
        removeArtistPrefix: false,
    },

    set: async (key, value) => {
        await configApi.set(key, value);
        set((state) => ({
            config: {
                ...state.config,
                [key]: value,
            },
        }));
    },

    isPromptType: (type) => {
        return get().config.promptType === type;
    },

    loadConfig: async () => {
        const response = await configApi.getAll();

        if (!response.success) return Promise.reject(response.error);

        set({
            config: response.data,
        });
    },
}));
