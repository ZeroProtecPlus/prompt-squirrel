import { thumbnailEventEmitter } from '@/lib/event-emitter';
import { ImageOff } from 'lucide-react';
import { useState } from 'react';
import CopyButton from '../shared/copy-button';
import { AspectRatio } from '../ui/aspect-ratio';

interface PromptImageItemProps {
    prompt: Prompt;
    onClick?: (prompt: Prompt) => void;
}

export default function PromptImageItem({ prompt, onClick }: PromptImageItemProps) {
    const [imageError, setImageError] = useState<boolean>(false);

    function onPromptCardClick(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        e.preventDefault();
        onClick?.(prompt);
    }

    function handleContextMenu(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        e.preventDefault();
        if (prompt.thumbnail) thumbnailEventEmitter.emit('thumbnailRightClick', prompt.thumbnail);
    }

    return (
        <AspectRatio
            ratio={1 / 1}
            onClick={onPromptCardClick}
            onContextMenu={handleContextMenu}
            className="relative group cursor-pointer border rounded-sm overflow-hidden"
        >
            <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-primary/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none px-2 py-1 text-background text-sm flex items-start">
                {prompt.name}
            </div>

            <CopyButton
                className="absolute size-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:opacity-100 hover:bg-muted opacity-0 transition-opacity"
                variant="outline"
                text={prompt.prompt}
            />

            {prompt.thumbnail && !imageError ? (
                <img
                    src={`thumbnail://${prompt.thumbnail}`}
                    alt={`${prompt.name} thumbnail`}
                    onError={() => setImageError(true)}
                    className="object-cover w-full h-full"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted/25 cursor-pointer">
                    <ImageOff className="size-1/2 stroke-1 text-muted" />
                </div>
            )}
        </AspectRatio>
    );
}
