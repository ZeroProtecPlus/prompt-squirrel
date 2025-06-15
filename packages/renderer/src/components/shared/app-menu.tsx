import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from '@/components/ui/menubar';
import { useState } from 'react';
import ExportMenuItem from './app-menu/export-menu-item';
import ImportMenuItem from './app-menu/import-menu-item';
import ConfigDialog from './config/config-dialog';
import MenubarThemeRadioGroup from './app-menu/theme-radio-group';
import PinToggleButton from './app-menu/pin-toggle-button';

export default function AppMenu() {
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
                    <MenubarThemeRadioGroup />
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger onClick={() => setConfigDialogOpen(true)}>설정</MenubarTrigger>
                <ConfigDialog open={configDialogOpen} onOpenChange={setConfigDialogOpen} />
            </MenubarMenu>
            
            <PinToggleButton className='ml-auto'/>
        </Menubar>
    );
}
