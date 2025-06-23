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

    // 1. Mantener el foco en el área de texto existente y reemplazar la parte seleccionada - la función Deshacer no funciona
    // const target = e.currentTarget;
    // const { selectionStart, selectionEnd } = target;
    // const newValue =
    //     target.value.substring(0, selectionStart) +
    //     formattedText +
    //     target.value.substring(selectionEnd);

    // target.value = newValue;

    // target.selectionStart = target.selectionEnd = selectionStart + formattedText.length;

    // afterPasted?.(newValue);

    // 2. Usando execCommand para insertar texto en la posición actual del cursor - la función Deshacer funciona pero es un método obsoleto
    const target = e.currentTarget;
    target.focus();

    document.execCommand('insertText', false, formattedText);

    afterPasted?.(target.value);
}
