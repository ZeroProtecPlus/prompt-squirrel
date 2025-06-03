import PromptList from '@/components/prompt/prompt-list';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import BaseLayout from '@/layout/base-layout';
import { useCategoryStore, usePromptStore, useTagStore } from '@/store';
import { useEffect } from 'react';

function App() {
    const loadCategories = useCategoryStore((state) => state.loadCategories);
    const loadTags = useTagStore((state) => state.loadTags);
    const loadPrompts = usePromptStore((state) => state.loadPrompts);

    useEffect(() => {
        async function load() {
            await loadCategories();
            await loadTags();
            await loadPrompts();
        }

        load();
    }, [loadCategories, loadTags, loadPrompts]);

    return (
        <>
            <TooltipProvider>
                <Toaster expand={false} position="top-center" richColors />
                <BaseLayout>
                    <PromptList />
                </BaseLayout>
            </TooltipProvider>
        </>
    );
}

export default App;
