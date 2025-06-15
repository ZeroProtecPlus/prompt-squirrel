import type { SearchResult } from 'minisearch';

export function searchResultToPrompt(searchResult: SearchResult): Prompt {
    return {
        id: searchResult.id,
        name: searchResult.name,
        prompt: searchResult.prompt,
        thumbnail: searchResult.thumbnail,
        category: searchResult.category,
        tags: searchResult.tags,
        createdAt: searchResult.createdAt,
    };
}
