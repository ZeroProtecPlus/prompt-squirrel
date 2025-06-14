import {
    removeArtistPrefix,
    removeUnderbar,
    toLocalPromptText,
    toNAIPromptText,
} from '@/lib/clipboard-utils';
import { useConfigStore } from '@/store/config.store';
import type { ClipboardEvent } from 'react';

export async function onPastePrompt(
    e: ClipboardEvent<HTMLTextAreaElement>,
    afterPasted?: (v: string) => void,
): Promise<void> {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    // const text = await navigator.clipboard.readText();
    if (!text) return;

    const configState = useConfigStore.getState();

    let formattedText = configState.isPromptType('local')
        ? toLocalPromptText(text)
        : toNAIPromptText(text);

    if (configState.config.removeUnderbar) formattedText = removeUnderbar(formattedText);
    if (configState.config.removeArtistPrefix) formattedText = removeArtistPrefix(formattedText);

    // 1. 기존 텍스트 영역에 포커스를 유지하고, 선택된 부분을 대체하는 방식 Undo 기능이 안됨
    // const target = e.currentTarget;
    // const { selectionStart, selectionEnd } = target;
    // const newValue =
    //     target.value.substring(0, selectionStart) +
    //     formattedText +
    //     target.value.substring(selectionEnd);

    // target.value = newValue;

    // target.selectionStart = target.selectionEnd = selectionStart + formattedText.length;

    // afterPasted?.(newValue);

    // 2. execCommand를 사용하여 현재 커서 위치에 텍스트 삽입 Undo 기능이 됨 그렇지만 deprecated 메서드
    const target = e.currentTarget;
    target.focus();

    document.execCommand('insertText', false, formattedText);

    afterPasted?.(target.value);
}
