type Prompt = {
    id: string;
    name: string;
    prompt: string;
    category: Category;
    tags: Tag[];
    createdAt: Date;
}

type Tag = {
    id: string;
    name: string;
    count: number;
};

type Category = {
    id: string;
    name: string;
};