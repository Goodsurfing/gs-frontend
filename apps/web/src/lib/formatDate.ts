/**
 * Дата для подписей «активно до …» в формате дд.мм.гггг, как formatDate
 * старого фронта. API отдаёт даты и как ISO, и как d.m.Y — принимаем оба.
 */
export function formatDayMonthYear(value: string | null | undefined): string {
    if (!value) return "";
    if (/^\d{2}\.\d{2}\.\d{4}/.test(value)) return value.slice(0, 10);
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
}

/**
 * Дата словами на языке страницы: «6 ноября 2026», «November 6, 2026». Нужна там, где дата
 * хранится строкой Date.toDateString() («Fri Nov 06 2026» — так её писало старое SPA в
 * localStorage) и раньше показывалась как есть, по-английски на русской странице.
 */
export function formatLongDate(value: string | null | undefined, locale: string): string {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" }).replace(/\s?г\.$/, "");
}
