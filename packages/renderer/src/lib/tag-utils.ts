import { useTagStore } from "@/store";

export function tagIdToTag(tagId: number): Tag;
export function tagIdToTag(tagIds: number[]): Tag[];
export function tagIdToTag(tagId: number | number[]): Tag | Tag[] {
    const tags = useTagStore.getState().tags;

    if (Array.isArray(tagId)) {
        return tagId
            .map((id) => tags.find((tag) => tag.id === id))
            .filter((tag) => tag !== undefined);
    }

    const tag = tags.find((tag) => tag.id === tagId);
    if (!tag) throw new Error(`Tag with id ${tagId} not found`);

    return tag;
}