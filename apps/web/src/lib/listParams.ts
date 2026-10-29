/** Параметры списков из адреса (?page=&sort=&search=&category=), как useNewsFilters старого фронта. */
export type ListSort = "new" | "popular";

export interface ListParams {
    page: number;
    sort: ListSort;
    search: string;
    category?: number;
}

export function listParams(searchParams: Record<string, string | string[] | undefined>): ListParams {
    const raw = (key: string) => {
        const value = searchParams[key];
        return Array.isArray(value) ? value[0] : value;
    };
    const page = Math.max(1, Number(raw("page")) || 1);
    const sort: ListSort = raw("sort") === "popular" ? "popular" : "new";
    const search = (raw("search") ?? "").trim();
    const category = Number(raw("category")) || undefined;
    return { page, sort, search, category };
}

/**
 * Адрес списка с параметрами. Значения по умолчанию (page=1, sort=new,
 * пустой поиск, без категории) в адрес не пишутся.
 */
export function listHref(path: string, params: Partial<ListParams>) {
    const query = new URLSearchParams();
    if (params.sort && params.sort !== "new") query.set("sort", params.sort);
    if (params.search) query.set("search", params.search);
    if (params.category) query.set("category", String(params.category));
    if (params.page && params.page > 1) query.set("page", String(params.page));
    const qs = query.toString();
    return qs ? `${path}?${qs}` : path;
}
