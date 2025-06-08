import { importCommand, exportCommand } from '@/commands/menu';
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from '@/components/ui/menubar';

export default function AppMenu() {
    return (
        <Menubar className="rounded-none">
            <MenubarMenu>
                <MenubarTrigger>파일</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem onClick={importCommand}>불러오기</MenubarItem>
                    <MenubarItem onClick={exportCommand}>내보내기</MenubarItem>
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger>도구</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>아직 생각중 ...</MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
}
