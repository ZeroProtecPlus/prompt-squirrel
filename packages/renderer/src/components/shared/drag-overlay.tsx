import { cn } from '@/lib/utils';
import { type DragEvent, useRef, useState } from 'react';

interface DragOverlayProps {
    children: React.ReactNode;
    className?: string;
    overlayMessage?: string;
    onDrop: (fileList: FileList) => void;
}

export default function DragOverlay({
    children,
    className,
    overlayMessage,
    onDrop,
}: DragOverlayProps) {
    const [isDragging, setIsDragging] = useState(false);
    const dragCounterRef = useRef<number>(0);

    function hasFile(e: DragEvent<HTMLDivElement>) {
        return e.dataTransfer.items && e.dataTransfer.items.length > 0;
    }

    const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        dragCounterRef.current++;
        if (hasFile(e)) setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        dragCounterRef.current--;

        if (dragCounterRef.current === 0) setIsDragging(false);
    };

    function handleDragOver(e: DragEvent<HTMLDivElement>) {
        e.preventDefault();

        if (hasFile(e)) e.dataTransfer.dropEffect = 'copy';
        else e.dataTransfer.dropEffect = 'none';
    }

    function handleDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        dragCounterRef.current = 0;
        setIsDragging(false);

        onDrop(e.dataTransfer.files);
    }

    return (
        <div
            className={cn('relative', className)}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div
                className={cn(
                    'absolute inset-0 z-10 flex items-center justify-center transition-all duration-200',
                    'border-2 border-dashed rounded-sm',
                    isDragging
                        ? 'bg-primary/50 border-primary opacity-100 pointer-events-auto'
                        : 'opacity-0 pointer-events-none border-transparent',
                )}
            >
                <div className="text-center">
                    <p className="text-lg font-medium text-primary">{overlayMessage}</p>
                </div>
            </div>
            {children}
        </div>
    );
}
