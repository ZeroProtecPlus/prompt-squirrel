interface BaseLayoutProps {
    children?: React.ReactNode;
}

export default function MainContent({ children }: BaseLayoutProps) {
    return <div className="flex-1 flex flex-col h-full">{children}</div>;
}
