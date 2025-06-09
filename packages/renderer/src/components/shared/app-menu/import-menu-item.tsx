import { importCommand } from '@/commands/menu';
import { useLoading } from '@/components/hooks';
import { MenubarItem } from '@/components/ui/menubar';
import { isServiceException } from '@/lib/utils';
import { toast } from 'sonner';

export default function ImportMenuItem() {
    const { loading, stopLoading } = useLoading();

    async function handleImport() {
        try {
            loading('프롬프트 불러오는 중...');
            await importCommand();
            stopLoading();
        } catch (error) {
            if (isServiceException(error))
                toast.error('프롬프트를 불러오는 도중 오류가 발생했습니다.');

            stopLoading();
        }
    }

    return <MenubarItem onClick={handleImport}>불러오기</MenubarItem>;
}
