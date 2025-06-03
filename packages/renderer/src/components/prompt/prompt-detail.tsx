import { Card, CardContent } from '@/components/ui/card';

export default function PromptDetail() {
    return (
        <Card className="flex-1 flex flex-col h-full w-full p-4 bg-background">
            <CardContent className="p-4 ">
                <div className="text-center text-muted-foreground">프롬프트를 선택해주세요.</div>
            </CardContent>
        </Card>
    );
}
