import { useLoadingStore } from "@/store/loading.store";
import { Loader2 } from "lucide-react";

export default function Loading() {
    const isLoading = useLoadingStore((state) => state.isLoading);
    const message = useLoadingStore((state) => state.message);

    if (!isLoading) return null;

    return (
        <div className={'fixed inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm animate-in fade-in-0 duration-200'}>
            <div className="flex flex-col items-center space-y-4">
                <Loader2 className={"animate-spin text-primary"} />
                <p className={"text-muted-foreground font-medium"}>{message}</p>
            </div>
        </div>
    );
}