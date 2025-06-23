import { useLoading } from '@/components/hooks/use-loading';
import PromptCreateDialog from '@/components/prompt/prompt-create-dialog';
import PromptList from '@/components/prompt/prompt-list';
import Loading from '@/components/shared/loading';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import BaseLayout from '@/layout/base-layout';
import { useCategoryStore, usePromptStore, useTagStore } from '@/store';
import { useEffect } from 'react';
import PromptThumbnailDetail from './components/prompt/prompt-thumbnail-detail';
import { ThemeProvider } from './components/provider/theme-provider';
import { useConfigStore } from './store/config.store';

function App() {
    const { loading, stopLoading } = useLoading();

    const loadConfig = useConfigStore((state) => state.loadConfig);
    const loadCategories = useCategoryStore((state) => state.loadCategories);
    const loadTags = useTagStore((state) => state.loadTags);
    const loadPrompts = usePromptStore((state) => state.loadPrompts);

    useEffect(() => {
        async function load() {
            loading('Cargando configuración...');
            await loadConfig();
            loading('Cargando categorías...');
            await loadCategories();
            loading('Cargando etiquetas...');
            await loadTags();
            loading('Cargando prompts...');
            await loadPrompts();
            stopLoading();
        }

        load();
    }, [loadConfig, loadCategories, loadTags, loadPrompts, loading, stopLoading]);

    return (
        <ThemeProvider>
            <TooltipProvider>
                <Loading />
                <Toaster expand={false} position="bottom-left" richColors closeButton />
                <BaseLayout className="relative">
                    <PromptList />
                    <PromptCreateDialog className="absolute right-10 bottom-10" />
                    <PromptThumbnailDetail />
                </BaseLayout>
            </TooltipProvider>
        </ThemeProvider>
    );
}

export default App;
