import { type OffersFilters, offersApiQuery, offersFiltersQuery } from "@/lib/offersFilters";

/** Фильтры подписки на подборку — те же параметры, что у GET /api/v1/vacancy, без «[]» в именах */
export function savedSearchFilters(filters: OffersFilters): Record<string, unknown> {
    return Object.fromEntries(Object.entries(offersApiQuery(filters)).map(([key, value]) => [key.replace(/\[\]$/, ""), value]));
}

/** Строка параметров карты для возврата после входа: те же фильтры и просьба подписаться */
export function subscribeReturnQuery(filters: OffersFilters, source: SavedSearchSource): string {
    const query = new URLSearchParams(offersFiltersQuery({ ...filters, page: 1, offerId: undefined }));
    query.set("subscribe", source);
    return query.toString();
}

/** Откуда подписались (для статистики): кнопка, пустой поиск, письмо */
export type SavedSearchSource = "button" | "empty" | "email";

export const parseSubscribeSource = (value: string | undefined): SavedSearchSource | null =>
    value === "email" || value === "empty" || value === "button" ? value : value === "1" ? "button" : null;
