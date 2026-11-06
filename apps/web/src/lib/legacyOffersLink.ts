/**
 * Ссылки старого каталога: `/offers/2?host_categories=[3]&order_by=…` — номер
 * страницы выдачи, а не вакансии. Такие ссылки до сих пор стоят в рекламе
 * Яндекса и открывали «Вакансия не найдена» (обращение 23.08). Переводим на
 * карту вакансий с той же категорией, сохраняя utm-метки и yclid для Метрики.
 */
const LEGACY_LIST_PARAMS = ["host_categories", "order_by", "min_participant_days", "max_participant_days", "language_skills", "period_start", "period_end", "place"];

type Query = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
    return Array.isArray(value) ? value[0] : value;
}

/** Адрес карты для старой ссылки каталога или null, если это обычная ссылка на вакансию */
export function legacyOffersListTarget(query: Query, mapPath: string): string | null {
    if (!LEGACY_LIST_PARAMS.some((key) => key in query)) return null;
    const target = new URLSearchParams();
    const categories = first(query.host_categories)?.match(/\d+/g);
    if (categories) target.set("category", categories.join(","));
    for (const [key, value] of Object.entries(query)) {
        const v = first(value);
        if (v !== undefined && (key.startsWith("utm_") || key === "yclid")) target.set(key, v);
    }
    const qs = target.toString();
    return qs ? `${mapPath}?${qs}` : mapPath;
}
