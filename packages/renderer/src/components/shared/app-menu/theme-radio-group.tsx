import { useTheme } from '@/components/hooks';
import { MenubarRadioGroup, MenubarRadioItem } from '@/components/ui/menubar';
import { electronApi } from '@app/preload';

export default function MenubarThemeRadioGroup() {
    const { theme, setTheme } = useTheme();

    const isTheme = (value: string): value is 'light' | 'dark' | 'green' | 'system' =>
        ['light', 'dark', 'green', 'system'].includes(value);

    async function handleThemeChange(newTheme: string) {
        if (!isTheme(newTheme)) return;

        await electronApi.setTheme(newTheme);
        setTheme(newTheme);
    }

    return (
        <MenubarRadioGroup value={theme} onValueChange={handleThemeChange}>
            <MenubarRadioItem value="light">Claro</MenubarRadioItem>
            <MenubarRadioItem value="dark">Oscuro</MenubarRadioItem>
            <MenubarRadioItem value="green">Verde</MenubarRadioItem>
            <MenubarRadioItem value="system">Sistema</MenubarRadioItem>
        </MenubarRadioGroup>
    );
}
