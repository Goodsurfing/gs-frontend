/**
 * Ссылка из данных (адрес рекламного баннера, файл отчёта) — только http(s), mailto или путь сайта.
 * Иначе `javascript:…`, введённый в поле, выполнился бы у посетителя или администратора по клику.
 */
export function safeHref(value: string | null | undefined): string | undefined {
    const url = (value ?? "").trim();
    if (!url) return undefined;
    if (url.startsWith("/") && !url.startsWith("//")) return url;
    return /^(https?:|mailto:)/i.test(url) ? url : undefined;
}
