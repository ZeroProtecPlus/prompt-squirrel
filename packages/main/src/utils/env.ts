export function isDevMode(): boolean {
    return import.meta.env.MODE === 'development';
}