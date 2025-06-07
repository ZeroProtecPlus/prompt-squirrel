import PromptList from '@/components/prompt/prompt-list';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import BaseLayout from '@/layout/base-layout';
import { useCategoryStore, usePromptStore, useTagStore } from '@/store';
import { useEffect } from 'react';
import PromptCreateDialog from './components/prompt/prompt-create-dialog';
import Loading from './components/shared/loading';
import { useLoading } from './hooks/use-loading';

function App() {
    const { loading, stopLoading } = useLoading();

    const loadCategories = useCategoryStore((state) => state.loadCategories);
    const loadTags = useTagStore((state) => state.loadTags);
    const loadPrompts = usePromptStore((state) => state.loadPrompts);

    useEffect(() => {
        async function load() {
            loading('카테고리 로딩중...');
            await loadCategories();
            loading('태그 로딩중...');
            await loadTags();
            loading('프롬프트 로딩중...');
            await loadPrompts();
            stopLoading();
        }

        load();
    }, [loadCategories, loadTags, loadPrompts, loading, stopLoading]);

    return (
        <>
            <TooltipProvider>
                <Loading />
                <Toaster expand={false} position="top-center" richColors />
                <BaseLayout className="relative">
                    <PromptList />
                    <PromptCreateDialog className="absolute right-10 bottom-10" />
                </BaseLayout>
            </TooltipProvider>
        </>
    );
}

export default App;
