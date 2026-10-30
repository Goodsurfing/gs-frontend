/**
 * Фильтры каталога сборов (/donation-map): направление, завершённые,
 * только успешные, сортировка, поиск, страница — всё в адресе, как у
 * каталога вакансий. В старом фронте фильтры жили в форме и терялись при
 * обновлении страницы; направление было в адресе (?category=) — оставлено.
 */
export const DONATIONS_PER_PAGE = 20;

export interface DonationsFilters {
    category?: number;
    closed: boolean;
    success: boolean;
    sort: "urgency" | "popular";
    search: string;
    page: number;
    /** Выбранный в списке сбор (подсвечен на карте) */
    fundraiseId?: string;
}

type Params = Record<string, string | string[] | undefined> | URLSearchParams;

const read = (params: Params, key: string) => {
    if (params instanceof URLSearchParams) return params.get(key) ?? undefined;
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
};

export function parseDonationsFilters(params: Params): DonationsFilters {
    const category = Number(read(params, "category"));
    return {
        category: Number.isInteger(category) && category > 0 ? category : undefined,
        closed: read(params, "closed") === "1",
        success: read(params, "success") === "1",
        sort: read(params, "sort") === "popular" ? "popular" : "urgency",
        search: (read(params, "search") ?? "").trim(),
        page: Math.max(1, Number(read(params, "page")) || 1),
        fundraiseId: read(params, "fundraiseId") || undefined,
    };
}

export function donationsFiltersQuery(filters: Partial<DonationsFilters>): string {
    const query = new URLSearchParams();
    if (filters.category) query.set("category", String(filters.category));
    if (filters.closed) query.set("closed", "1");
    if (filters.success) query.set("success", "1");
    if (filters.sort === "popular") query.set("sort", "popular");
    if (filters.search) query.set("search", filters.search);
    if (filters.page && filters.page > 1) query.set("page", String(filters.page));
    if (filters.fundraiseId) query.set("fundraiseId", filters.fundraiseId);
    return query.toString();
}

/** Параметры API для карты (без страницы и сортировки) — как donationMapFilterApiAdapter старого фронта */
export function donationsMapApiQuery(filters: DonationsFilters) {
    return {
        categoryId: filters.category,
        isCloseProject: filters.closed,
        isSuccessProject: filters.success,
        name: filters.search || undefined,
    };
}

/** Параметры API для списка — как donationFilterApiAdapter: «по срочности» — по дате окончания */
export function donationsApiQuery(filters: DonationsFilters) {
    return {
        ...donationsMapApiQuery(filters),
        sort: filters.sort === "urgency" ? "endDate:desc" as const : undefined,
        isAuth: false,
        limit: DONATIONS_PER_PAGE,
        page: filters.page,
    };
}
