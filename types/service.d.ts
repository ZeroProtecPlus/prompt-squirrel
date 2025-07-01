type ExportType = 'templateloader' | 'squirrel' | 'wildcard';
type ExportOptions = {
    prompts: Prompt[];
    type?: ExportType;
    fileName?: string;
}

type DuplicateHandlingStrategy = 'skip' | 'rename' | 'overwrite';

type ImportOptions = {
    filePath?: string;
    duplicateStrategy?: DuplicateHandlingStrategy;
}

type ImportPreviewResult = {
    totalPrompts: number;
    duplicates: string[];
    validPrompts: SquirrelObject[];
    filePath?: string;
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