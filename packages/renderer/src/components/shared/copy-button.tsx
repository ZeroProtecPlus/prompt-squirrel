import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { delay } from 'es-toolkit';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface CopyButtonProps {
    text: string;
    className?: string;
    variant?: 'default' | 'outline' | 'ghost' | 'link';
}

export default function CopyButton({ text, className, variant }: CopyButtonProps) {
    const [isCopied, setIsCopied] = useState(false);

    async function handleCopy(e: React.MouseEvent) {
        e.stopPropagation();
        await navigator.clipboard.writeText(text);
        toast.success('클립보드에 복사되었습니다.');
        setIsCopied(true);
        await delay(2000);
        setIsCopied(false);
    }

    return (
        <Button
            className={cn('relative w-full h-full hover:bg-transparent', className)}
            variant={variant || 'ghost'}
            onClick={handleCopy}
        >
            <Copy
                className={cn(
                    'absolute size-6 transition-all duration-300 text-accent-foreground',
                    isCopied ? 'opacity-0 scale-75' : 'opacity-100 scale-100',
                )}
            />
            <Check
                className={cn(
                    'absolute size-6 transition-all duration-300 text-green-600 stroke-3',
                    isCopied ? 'opacity-100 scale-100' : 'opacity-0 scale-75',
                )}
            />
        </Button>
    );
}
