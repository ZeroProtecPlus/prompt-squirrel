function isNAIPromptText(text: string): boolean {
    const naiFormatRegex = /\b\d+(?:\.\d+)?::[^:()]+::/;
    return naiFormatRegex.test(text);
}

function isLocalPromptText(text: string): boolean {
    const hasWeightSyntax = /\([^():]+:[\d.]+\)/.test(text);
    const hasEscapedParentheses = /\\\([^()]+\\\)/.test(text);
    return hasWeightSyntax || hasEscapedParentheses;
}

export function toNAIPromptText(text: string): string {
    if (isNAIPromptText(text)) return text;

    // (문자열:숫자) 문법을 :: 문법으로 변환
    const regexWeightParentheses = /(?<!\()\(([^():]+):([\d.]+)\)(?!\))/g;

    return text.replace(regexWeightParentheses, (_, p1, p2) => {
        return `${p2}::${p1}::`;
    });
}

export function toLocalPromptText(text: string): string {
    if (isLocalPromptText(text)) return text;

    const regexWeightColon = /([\d.-]+)::(.+?)::/g;
    const regexWeightBrackets = /(\{+)([^{}]+)(\}+)|(\[+)([^[\]]+)(\]+)/g;

    return text
        .replace(/(\(+)([^()]+)(\)+)/g, (_, open, content, close) => {
            if (open.length === 1 && close.length === 1) return `\\(${content}\\)`;

            return content;
        })
        .replace(regexWeightColon, (_, p1, p2) => {
            const weight = Number.parseFloat(p1);
            const content = p2.trim();
            return weight <= 0 || weight === 1 ? p2 : `(${content}:${weight})`;
        })
        .replace(regexWeightBrackets, (...args) => {
            const openBrace = args[1];
            const braceContent = args[2];
            const openBracket = args[4];
            const bracketContent = args[5];

            if (openBrace && braceContent) {
                const weight = 1.05 ** openBrace.length;
                return weight === 1 ? braceContent : `(${braceContent}:${formatWeight(weight)})`;
            }

            if (openBracket && bracketContent) {
                const weight = 1 / 1.05 ** openBracket.length;
                return weight === 1
                    ? bracketContent
                    : `(${bracketContent}:${formatWeight(weight)})`;
            }

            return args[0];
        });
}

export function removeUnderbar(text: string): string {
    return text.replace(/_/g, ' ');
}

export function removeArtistPrefix(text: string): string {
    return text.replace(/\bartist:\s*/gi, '');
}

function formatWeight(weight: number): string {
    return Number.parseFloat(weight.toFixed(2)).toString();
}
