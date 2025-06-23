type Theme = 'dark' | 'light' | 'green' | 'system';

type Filterable<T> = keyof Pick<T, Extract<keyof T, 'category' | 'tags'>>;

type SearchFilterOptions = {
    query: Query;
    category: Category | null;
    tags: string[];
}

type OrderField = keyof Pick<Prompt, 'name' | 'createdAt'>;
type OrderDirection = 'asc' | 'desc';

type OrderByOptions = {
    field: OrderField;
    direction: OrderDirection;
}

type OrderFunction = (prompts: Prompt[], direction: OrderDirection) => void;

// En T, filtra solo las propiedades clave del tipo de función
// biome-ignore lint/suspicious/noExplicitAny: Se utiliza any para soportar todas las funciones
type MethodKeys<T> = {
    [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

// Extrae directamente el tipo de función de un método específico K
type MethodFunction<T, K extends MethodKeys<T>> = T[K] extends (...args: infer P) => infer R
    ? (...args: P) => R
    : never;

// Devuelve el tipo de función de un método específico K (manteniendo el tipo Promise<IPCResponse<T>> sin cambios)
type GetMethodPromiseReturnType<T, K extends MethodKeys<T>> = ReturnType<MethodFunction<T, K>>;

// Tipo de tupla de argumentos del método específico K
type GetMethodParameters<T, K extends MethodKeys<T>> = Parameters<MethodFunction<T, K>>;
