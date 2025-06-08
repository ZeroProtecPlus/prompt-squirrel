import { josa } from 'es-hangul';

export function createSuccessMessage(name: string): string {
    return `${josa(name, '이/가')} 생성되었습니다.`;
}

export function updateSuccessMessage(name: string): string {
    return `${josa(name, '이/가')} 수정되었습니다.`;
}

export function deleteSuccessMessage(name?: string): string {
    return name ? `${josa(name, '이/가')} 삭제되었습니다.` : '삭제되었습니다.';
}
