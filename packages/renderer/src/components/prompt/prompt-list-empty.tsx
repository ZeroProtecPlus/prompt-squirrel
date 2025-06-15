import { Card } from '@/components/ui/card';

export default function PromptListItemEmpty() {
    return (
        <Card className="p-4 min-h-[620px] text-center text-muted-foreground flex items-center justify-center col-span-4 md:col-span-6 lg:col-span-8">
            프롬프트가 존재하지 않습니다.
        </Card>
    );
}
