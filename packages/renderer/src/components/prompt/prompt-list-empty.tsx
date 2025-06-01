import { Card } from '@/components/ui/card';

export default function PromptListItemEmpty() {
    return (
        <Card className="p-4 text-center text-muted-foreground h-full flex items-center justify-center">
            프롬프트가 존재하지 않습니다.
        </Card>
    );
}
