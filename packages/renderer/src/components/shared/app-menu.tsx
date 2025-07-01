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
import PinToggleButton from './app-menu/pin-toggle-button';
import MenubarThemeRadioGroup from './app-menu/theme-radio-group';
import ConfigDialog from './config/config-dialog';

export default function AppMenu() {
    const [configDialogOpen, setConfigDialogOpen] = useState<boolean>(false);

    return (
        <Menubar className="rounded-none">
            <MenubarMenu>
                <MenubarTrigger>Archivo</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem disabled>Nuevo prompt</MenubarItem>
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger>Herramientas</MenubarTrigger>
                <MenubarContent>
                    <ImportMenuItem />
                    <ExportMenuItem />
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger>Tema</MenubarTrigger>
                <MenubarContent>
                    <MenubarThemeRadioGroup />
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger onClick={() => setConfigDialogOpen(true)}>Configuración</MenubarTrigger>
                <ConfigDialog open={configDialogOpen} onOpenChange={setConfigDialogOpen} />
            </MenubarMenu>

            <PinToggleButton className="ml-auto" />
        </Menubar>
    );
}