import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { electronApi } from "@app/preload";
import { Pin } from "lucide-react";
import { useState } from "react";

interface PinToggleButtonProps {
    className?: string;
}

export default function PinToggleButton({ className }: PinToggleButtonProps) {
    const [isPinned, setIsPinned] = useState<boolean>(false);

    async function togglePin() {
        const newPinnedState = !isPinned;
        await electronApi.setPinnedWindow(newPinnedState);
        setIsPinned(newPinnedState);
    }

    return (
        <Button
            className={cn(className, 
                'rounded-4xl size-6',
                isPinned ? 'bg-primary text-primary-foreground' : 'bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
            onClick={togglePin}
        >
            <Pin className="p-0 rotate-45"/>
        </Button>
    )
}