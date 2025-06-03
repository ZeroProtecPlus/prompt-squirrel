import AppMenu from '@/components/shared/app-menu';
import MainContent from '@/components/shared/main-content';
import Sidebar from '@/components/shared/side-bar';

interface BaseLayoutProps {
    children?: React.ReactNode;
}

export default function BaseLayout({ children }: BaseLayoutProps) {
    return (
        <div className="container max-w-none w-screen h-screen flex flex-col bg-background">
            <div>
                <AppMenu />
            </div>
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <MainContent>{children}</MainContent>
            </div>
        </div>
    );
}
