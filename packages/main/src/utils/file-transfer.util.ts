import { UnexpectedException } from '../common/exceptions/unexpected.exception.js';

interface IPromptSerializer {
    templateLoader(prompts: Prompt[]): string;
    squirrel(prompts: Prompt[]): string;
    wildcard(prompts: Prompt[]): string;
    serialize(prompts: Prompt[], type: ExportType): string;
}

export class PromptSerializer implements IPromptSerializer {
    templateLoader(prompts: Prompt[]): string {
        return JSON.stringify(parseToTemplateLoaderObject(prompts), null, 2);
    }

    squirrel(prompts: Prompt[]): string {
        return JSON.stringify(parseToSquirrelObject(prompts), null, 2);
    }

    wildcard(prompts: Prompt[]): string {
        return parseToWildcardObject(prompts);
    }

    serialize(prompts: Prompt[], type: ExportType): string {
        if (type === 'templateloader') return this.templateLoader(prompts);
        if (type === 'squirrel') return this.squirrel(prompts);
        if (type === 'wildcard') return this.wildcard(prompts);

        throw new UnexpectedException(`Unsupported export type: ${type}`);
    }
}

function parseToTemplateLoaderObject(prompts: Prompt[]): TemplateLoaderObject {
    return prompts.reduce<TemplateLoaderObject>((acc, prompt) => {
        acc[prompt.name] = prompt.prompt;
        return acc;
    }, {});
}

function parseToSquirrelObject(prompts: Prompt[]): SquirrelObject[] {
    return prompts.map((prompt) => ({
        name: prompt.name,
        prompt: prompt.prompt,
        category: prompt.category ? prompt.category.name : null,
        tags: prompt.tags.map((tag) => tag.name),
    }));
}

function parseToWildcardObject(prompts: Prompt[]): string {
    return prompts.map((prompt) => prompt.prompt.replaceAll(/\n/g, '')).join('\n');
}

export function isSquirrelObject(obj: object): obj is SquirrelObject {
    return (
        typeof obj === 'object' &&
        'name' in obj &&
        typeof obj.name === 'string' &&
        'prompt' in obj &&
        typeof obj.prompt === 'string' &&
        'category' in obj &&
        typeof obj.category === 'string' &&
        'tags' in obj &&
        Array.isArray(obj.tags) &&
        obj.tags.every((tag) => typeof tag === 'string')
    );
}
