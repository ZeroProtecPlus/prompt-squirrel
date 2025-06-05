import { josa } from "es-hangul";

export function createSuccessMessage(name: string): string {
    return `${josa(`"${name}"`, '이/가')} 생성되었습니다.`
}

export function deleteSuccessMessage(name: string): string {
    return `${josa(`"${name}"`, '이/가')} 삭제되었습니다.`
}