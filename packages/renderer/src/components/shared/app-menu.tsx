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
import { useState } from 'react';
import ExportMenuItem from './app-menu/export-menu-item';
import ImportMenuItem from './app-menu/import-menu-item';
import ConfigDialog from './config/config-dialog';

export default function AppMenu() {
    const { theme, setTheme } = useTheme();

    const [configDialogOpen, setConfigDialogOpen] = useState<boolean>(false);

    return (
        <Menubar className="rounded-none">
            <MenubarMenu>
                <MenubarTrigger>파일</MenubarTrigger>
                <MenubarContent>
                    <ImportMenuItem />
                    <ExportMenuItem />
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
            <MenubarMenu>
                <MenubarTrigger onClick={() => setConfigDialogOpen(true)}>설정</MenubarTrigger>
                <ConfigDialog open={configDialogOpen} onOpenChange={setConfigDialogOpen} />
            </MenubarMenu>
        </Menubar>
    );
}
