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
