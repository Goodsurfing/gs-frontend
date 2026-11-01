/** Обрезка как textSlice старого фронта: длиннее length — первые length−1 символов и «..» */
export function textSlice(text: string | null | undefined, length: number, fallback: string): string {
    if (!text) return fallback;
    return text.length > length ? `${text.slice(0, length - 1)}..` : text;
}
