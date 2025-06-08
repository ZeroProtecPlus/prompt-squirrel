import { exportCommand, importCommand } from '@/commands/menu';
import { useTheme } from '@/components/hooks';
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarTrigger,
} from '@/components/ui/menubar';

export default function AppMenu() {
    const { theme, setTheme } = useTheme();

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
            <MenubarMenu>
                <MenubarTrigger>테마</MenubarTrigger>
                <MenubarContent>
                    <MenubarRadioGroup value={theme}>
                        <MenubarRadioItem value="light" onSelect={() => setTheme('light')}>
                            라이트
                        </MenubarRadioItem>
                        <MenubarRadioItem value="dark" onSelect={() => setTheme('dark')}>
                            다크
                        </MenubarRadioItem>
                        <MenubarRadioItem value="green" onSelect={() => setTheme('green')}>
                            그린
                        </MenubarRadioItem>
                        <MenubarRadioItem value="system" onSelect={() => setTheme('system')}>
                            시스템
                        </MenubarRadioItem>
                    </MenubarRadioGroup>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
}
