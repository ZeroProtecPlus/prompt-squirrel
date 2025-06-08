type Theme = 'dark' | 'light' | 'green' | 'system';

type Filterable<T> = keyof Pick<T, Extract<keyof T, 'category' | 'tags'>>;

type SearchFilterOptions = {
    query: Query;
    category: Category | null;
    tags: string[];
}

// T에서 함수 타입인 속성들의 키만 필터링하는 타입
type MethodKeys<T> = {
    // biome-ignore lint/suspicious/noExplicitAny: 모든 함수를 지원하기 위해 any 사용
    [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

// 특정 메소드 K의 함수 타입을 직접 추출하는 타입
type MethodFunction<T, K extends MethodKeys<T>> = T[K] extends (...args: infer P) => infer R
    ? (...args: P) => R
    : never;

// 특정 메소드 K의 반환 타입 (Promise<IPCResponse<T>> 형태 그대로)
type GetMethodPromiseReturnType<T, K extends MethodKeys<T>> = ReturnType<MethodFunction<T, K>>;

// 특정 메소드 K의 인자 튜플 타입
type GetMethodParameters<T, K extends MethodKeys<T>> = Parameters<MethodFunction<T, K>>;
