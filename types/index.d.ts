type Prompt = {
    id: number;
    name: string;
    prompt: string;
    category: Category;
    tags: Tag[];
    createdAt: Date;
}

type Tag = {
    id: number;
    name: string;
    count: number;
};

type Category = {
    id: number;
    name: string;
};