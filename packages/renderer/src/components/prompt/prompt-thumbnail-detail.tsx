import { thumbnailEventEmitter } from '@/lib/event-emitter';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

export default function PromptThumbnailDetail() {
    const [visible, setVisible] = useState<boolean>(false);
    const [thumbnail, setThumbnail] = useState<string>('');
    const overlayRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handleThumbnailClick(thumbnail: string) {
            setThumbnail(thumbnail);
            setVisible(true);
        }

        thumbnailEventEmitter.on('thumbnailRightClick', handleThumbnailClick);
        return () => thumbnailEventEmitter.off('thumbnailRightClick', handleThumbnailClick);
    }, []);

    useEffect(() => {
        if (visible) {
            overlayRef.current?.focus();
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [visible]);

    function close() {
        setVisible(false);
        setThumbnail('');
    }

    return (
        <div
            className={cn(
                'fixed inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-xs transition-opacity duration-100',
                visible ? 'opacity-100' : 'opacity-0 pointer-events-none',
            )}
            ref={overlayRef}
            onClick={close}
            onKeyDown={close}
            tabIndex={0}
            role="button"
        >
            <div className="bg-white p-2 rounded shadow-xl">
                {thumbnail && (
                    <img
                        src={`thumbnail://${thumbnail}`}
                        alt="thumbnail"
                        className="max-w-full max-h-[90vh] object-contain"
                    />
                )}
            </div>
        </div>
    );
}
