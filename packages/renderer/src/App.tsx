import PromptList from '@/components/prompt/prompt-list';
import BaseLayout from '@/layout/base-layout';
import { useCategoryStore, usePromptStore, useTagStore } from '@/store';
import { useEffect } from 'react';
import { TooltipProvider } from './components/ui/tooltip';

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
                <BaseLayout>
                    <PromptList />
                </BaseLayout>
            </TooltipProvider>
        </>
    );
}

export default App;
