import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { usePromptStore } from '@/store';

export default function PromptOrderSelect() {
    const orderBy = usePromptStore((state) => state.orderBy);
    const setOrderBy = usePromptStore((state) => state.setOrderBy);
    const search = usePromptStore((state) => state.search);

    function handleValueChange(value: string) {
        const [field, direction] = value.split(':') as [OrderField, OrderDirection];
        setOrderBy(field, direction);
        search();
    }

    function orderByToDisplayName(orderBy: OrderByOptions): string {
        return `${orderBy.field === 'createdAt' ? '생성일' : '이름순'} (${orderBy.direction === 'asc' ? '오름차순' : '내림차순'})`;
    }

    return (
        <Select onValueChange={handleValueChange} defaultValue="created_at:desc">
            <SelectTrigger>
                <SelectValue placeholder="정렬 기준">{orderByToDisplayName(orderBy)}</SelectValue>
            </SelectTrigger>

            <SelectContent>
                <SelectItem value="createdAt:asc">생성일 (오름차순)</SelectItem>
                <SelectItem value="createdAt:desc">생성일 (내림차순)</SelectItem>
                <SelectItem value="name:asc">이름순 (오름차순)</SelectItem>
                <SelectItem value="name:desc">이름순 (내림차순)</SelectItem>
            </SelectContent>
        </Select>
    );
}
