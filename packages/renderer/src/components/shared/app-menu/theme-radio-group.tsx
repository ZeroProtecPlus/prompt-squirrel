import { useTheme } from "@/components/hooks";
import { MenubarRadioGroup, MenubarRadioItem } from "@/components/ui/menubar";
import { electronApi } from "@app/preload";

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
            <MenubarRadioItem value="light">
                라이트
            </MenubarRadioItem>
            <MenubarRadioItem value="dark">
                다크
            </MenubarRadioItem>
            <MenubarRadioItem value="green">
                그린
            </MenubarRadioItem>
            <MenubarRadioItem value="system">
                시스템
            </MenubarRadioItem>
        </MenubarRadioGroup>
    );
}