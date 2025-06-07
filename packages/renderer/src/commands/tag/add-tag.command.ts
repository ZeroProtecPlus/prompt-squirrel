import { isServiceException } from '@/lib/utils';
import { useTagStore } from '@/store';

export async function addTagCommand(name: string, onError?: ServiceExceptionHandler) {
    const addTag = useTagStore.getState().addTag;
    try {
        await addTag(name);
    } catch (error) {
        if (isServiceException(error)) onError?.(error);
        console.error('Failed to add tag:', error);
    }
}
