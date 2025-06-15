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

type Category = {
    id: number;
    name: string;
};