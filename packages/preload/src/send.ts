import { ipcRenderer } from 'electron';

export function createSender<TController, TChannelName extends IPCChannels>() {
    return {
        send: <K extends MethodKeys<TController>>(
            channel: `${TChannelName}:${string & K}`,
            ...args: GetMethodParameters<TController, K>
        ): GetMethodPromiseReturnType<TController, K> => {
            return ipcRenderer.invoke(channel, ...args) as GetMethodPromiseReturnType<
                TController,
                K
            >;
        },
    };
}
