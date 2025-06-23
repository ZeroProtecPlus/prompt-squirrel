export function createSuccessMessage(name: string): string {
    return `${name} ha sido creado.`;
}

export function updateSuccessMessage(name: string): string {
    return `${name} ha sido modificado.`;
}

export function deleteSuccessMessage(name?: string): string {
    return name ? `${name} ha sido eliminado.` : 'Ha sido eliminado.';
}
