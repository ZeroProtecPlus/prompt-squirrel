import { isServiceException } from '@/lib/utils';
import { useTagStore } from '@/store';

export async function removeTagCommand(tag: Tag, onError?: ServiceExceptionHandler) {
    const removeTag = useTagStore.getState().removeTag;

    try {
        return await removeTag(tag);
    } catch (error) {
        if (isServiceException(error)) onError?.(error);
        console.error('Failed to remove tag:', error);
    }
}
