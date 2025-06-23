import { importCommand } from '@/commands/menu';
import { useLoading } from '@/components/hooks';
import { MenubarItem } from '@/components/ui/menubar';
import { isServiceException } from '@/lib/utils';
import { toast } from 'sonner';

export default function ImportMenuItem() {
    const { loading, stopLoading } = useLoading();

    async function handleImport() {
        try {
            loading('Cargando prompts...');
            await importCommand();
            stopLoading();
        } catch (error) {
            if (isServiceException(error))
                toast.error('Ocurrió un error al cargar los prompts.');

            stopLoading();
        }
    }

    return <MenubarItem onClick={handleImport}>Importar</MenubarItem>;
}
