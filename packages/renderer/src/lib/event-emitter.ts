import mitt from 'mitt';

type PromptEvent = {
    promptSearch: void;
};

export const promptEventEmitter = mitt<PromptEvent>();

type ThumbnailEvent = {
    thumbnailRightClick: string;
}

export const thumbnailEventEmitter = mitt<ThumbnailEvent>();
