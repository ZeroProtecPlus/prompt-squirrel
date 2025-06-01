import MainContent from '@/components/shared/main-content';
import Sidebar from '@/components/shared/side-bar';

interface BaseLayoutProps {
    children?: React.ReactNode;
}

export default function BaseLayout({ children }: BaseLayoutProps) {
    return (
        <div className="container max-w-none w-screen h-screen flex bg-background">
            <Sidebar />
            <MainContent>{children}</MainContent>
        </div>
    );
}
