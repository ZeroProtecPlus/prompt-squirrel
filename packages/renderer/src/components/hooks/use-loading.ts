import { useLoadingStore } from '@/store/loading.store';

export function useLoading() {
    const isLoading = useLoadingStore((state) => state.isLoading);
    const message = useLoadingStore((state) => state.message);
    const loading = useLoadingStore((state) => state.loading);
    const stopLoading = useLoadingStore((state) => state.stopLoading);

    return {
        isLoading,
        message,
        loading,
        stopLoading,
    };
}
