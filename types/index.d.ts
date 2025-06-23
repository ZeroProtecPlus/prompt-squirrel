type Prompt = {
    id: number;
    name: string;
    prompt: string;
    category: Category;
    tags: Tag[];
    thumbnail: string | null;
    createdAt: Date;
}

type Tag = {
    id: number;
    name: string;
};

type ExportType = 'squirrel' | 'templateloader' | 'wildcard' | 'json';

type Category = {
    id: number;
    name: string;
};