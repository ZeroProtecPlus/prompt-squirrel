import { ImageOff } from 'lucide-react';
import { AspectRatio } from '../ui/aspect-ratio';

interface PromptImageItemProps {
    prompt: Prompt;
    onClick?: (prompt: Prompt) => void;
}

export default function PromptImageItem({ prompt, onClick }: PromptImageItemProps) {
    function onPromptCardClick() {
        onClick?.(prompt);
    }

    return (
        <AspectRatio
            ratio={1 / 1}
            onClick={onPromptCardClick}
            className="relative group cursor-pointer"
        >
            <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-primary/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none px-2 py-1 text-background text-sm flex items-start">
                {prompt.name}
            </div>
            {prompt.thumbnail ? (
                <img src={prompt.thumbnail} alt={`${prompt.name} thumbnail`} />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted cursor-pointer">
                    <ImageOff />
                </div>
            )}
        </AspectRatio>
    );
}
