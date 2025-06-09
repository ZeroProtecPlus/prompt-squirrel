type ExportType = 'templateloader' | 'squirrel' | 'wildcard';
type ExportOptions = {
    prompts: Prompt[];
    type?: ExportType;
    fileName?: string;
}

type TemplateLoaderObject = {
    [key: string]: string;
}

type SquirrelObject = {
    name: string;
    prompt: string;
    category: string | null;
    tags: string[];
}