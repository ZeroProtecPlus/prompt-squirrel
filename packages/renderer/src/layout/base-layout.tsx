import AppMenu from '@/components/shared/app-menu';
import MainContent from '@/components/shared/main-content';
import Sidebar from '@/components/shared/side-bar';
import { cn } from '@/lib/utils';

interface BaseLayoutProps {
    children?: React.ReactNode;
    className?: string;
}

export default function BaseLayout({ children, className }: BaseLayoutProps) {
    return (
        <div
            className={cn(
                'container max-w-none w-screen h-screen flex flex-col bg-background',
                className,
            )}
        >
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
