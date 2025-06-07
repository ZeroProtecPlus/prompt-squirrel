import { SelectTag } from '../database/table/tag.js';

export function toTagDto(tag: SelectTag): TagDto {
    return {
        id: tag.id,
        name: tag.name,
        createdAt: tag.created_at,
    };
}
