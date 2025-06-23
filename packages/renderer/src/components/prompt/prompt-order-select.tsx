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

    function handleValueChange(value: string) {
        const [field, direction] = value.split(':') as [OrderField, OrderDirection];
        setOrderBy(field, direction);
    }

    function orderByToDisplayName(orderBy: OrderByOptions): string {
        return `${orderBy.field === 'createdAt' ? 'Fecha de creación' : 'Por nombre'} (${orderBy.direction === 'asc' ? 'Ascendente' : 'Descendente'})`;
    }

    return (
        <Select onValueChange={handleValueChange} defaultValue="created_at:desc">
            <SelectTrigger>
                <SelectValue placeholder="Criterio de ordenación">{orderByToDisplayName(orderBy)}</SelectValue>            </SelectTrigger>

            <SelectContent>
                <SelectItem value="createdAt:asc">Fecha de creación (Ascendente)</SelectItem>
                <SelectItem value="createdAt:desc">Fecha de creación (Descendente)</SelectItem>
                <SelectItem value="name:asc">Por nombre (Ascendente)</SelectItem>
                <SelectItem value="name:desc">Por nombre (Descendente)</SelectItem>
            </SelectContent>
        </Select>
    );
}
