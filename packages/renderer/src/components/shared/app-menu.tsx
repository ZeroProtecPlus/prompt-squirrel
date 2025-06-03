import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from '@/components/ui/menubar';

export default function AppMenu() {
    return (
        <Menubar className='rounded-none'>
            <MenubarMenu>
                <MenubarTrigger>파일</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>불러오기</MenubarItem>
                    <MenubarItem>내보내기</MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem>종료</MenubarItem>
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