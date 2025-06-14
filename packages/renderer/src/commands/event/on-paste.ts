import {
    removeArtistPrefix,
    removeUnderbar,
    toLocalPromptText,
    toNAIPromptText,
} from '@/lib/clipboard-utils';
import { useConfigStore } from '@/store/config.store';
import type { ClipboardEvent } from 'react';

export function onPastePrompt(
    e: ClipboardEvent<HTMLTextAreaElement>,
    afterPasted?: (v: string) => void,
): void {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    if (!text) return;

    const configState = useConfigStore.getState();

    console.log('Config State:', configState.config);

    let formattedText = configState.isPromptType('local')
        ? toLocalPromptText(text)
        : toNAIPromptText(text);

    if (configState.config.removeUnderbar) formattedText = removeUnderbar(formattedText);
    if (configState.config.removeArtistPrefix) formattedText = removeArtistPrefix(formattedText);

    const target = e.currentTarget;
    const { selectionStart, selectionEnd } = target;
    const newValue =
        target.value.substring(0, selectionStart) +
        formattedText +
        target.value.substring(selectionEnd);

    target.value = newValue;

    target.selectionStart = target.selectionEnd = selectionStart + formattedText.length;

    afterPasted?.(newValue);
}
