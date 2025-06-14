import mitt from 'mitt';

type PromptEvent = {
    promptSearch: void;
};

export const promptEventEmitter = mitt<PromptEvent>();
