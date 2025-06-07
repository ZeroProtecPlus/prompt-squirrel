import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function isServiceException(error: unknown): error is ServiceException {
    return error !== null && typeof error === 'object' && 'code' in error && 'name' in error && 'message' in error;
}