import { Card } from '@/components/ui/card';

export default function PromptListItemEmpty() {
    return (
        <Card className="p-4 text-center text-muted-foreground flex items-center justify-center col-span-4 md:col-span-5 lg:col-span-6">
            프롬프트가 존재하지 않습니다.
        </Card>
    );
}
