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
};

type Category = {
    id: number;
    name: string;
};