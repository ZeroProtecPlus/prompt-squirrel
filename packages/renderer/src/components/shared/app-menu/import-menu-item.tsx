import { importCommand } from '@/commands/menu';
import { useLoading } from '@/components/hooks';
import { MenubarItem } from '@/components/ui/menubar';

export default function ImportMenuItem() {
    const { loading, stopLoading } = useLoading();

    async function handleImport() {
        loading('프롬프트 불러오는 중...');
        await importCommand();
        stopLoading();
    }

    return <MenubarItem onClick={handleImport}>불러오기</MenubarItem>;
}
