/**
 * Обрезка как textSlice старого фронта: длиннее length — первые length−1 символов и «..».
 * Считаем символы (code points), а не половинки UTF-16: иначе разрез посреди эмодзи
 * оставляет одиночный суррогат — сервер рисует «�», браузер — свой символ, и React
 * падает с ошибкой гидратации #418 (так было на /offers/6830).
 */
export function textSlice(text: string | null | undefined, length: number, fallback: string): string {
    if (!text) return fallback;
    const chars = Array.from(text);
    return chars.length > length ? `${chars.slice(0, length - 1).join("")}..` : text;
}

/** Первые length символов без разреза эмодзи пополам */
export function takeChars(text: string, length: number): string {
    const chars = Array.from(text);
    return chars.length > length ? chars.slice(0, length).join("") : text;
}

/** Первый символ строки (эмодзи — целиком) */
export function firstChar(text: string): string {
    return Array.from(text)[0] ?? "";
}
