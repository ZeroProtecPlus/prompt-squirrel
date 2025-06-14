import { Options, Schema } from 'electron-store';

export const configValidationSchema: Schema<AppConfig> = {
    promptType: {
        type: 'string',
        enum: ['local', 'nai'],
    },
    removeUnderbar: {
        type: 'boolean',
    },
    removeArtistPrefix: {
        type: 'boolean',
    },
};

export const defaultConfig: AppConfig = {
    promptType: 'local',
    removeUnderbar: true,
    removeArtistPrefix: true,
};

export const storeConfig: Options<AppConfig> = {
    name: 'app-config',
    defaults: defaultConfig,
    schema: configValidationSchema,
};
