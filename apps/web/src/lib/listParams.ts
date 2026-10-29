/** Параметры списков из адреса (?page=&sort=), как useNewsFilters старого фронта. */
export type ListSort = "new" | "popular";

export function listParams(searchParams: Record<string, string | string[] | undefined>) {
    const raw = (key: string) => {
        const value = searchParams[key];
        return Array.isArray(value) ? value[0] : value;
    };
    const page = Math.max(1, Number(raw("page")) || 1);
    const sort: ListSort = raw("sort") === "popular" ? "popular" : "new";
    return { page, sort };
}

/** Адрес списка с параметрами; page=1 и sort=new — значения по умолчанию, в адрес не пишутся. */
export function listHref(path: string, params: { page?: number; sort?: ListSort }) {
    const query = new URLSearchParams();
    if (params.sort && params.sort !== "new") query.set("sort", params.sort);
    if (params.page && params.page > 1) query.set("page", String(params.page));
    const qs = query.toString();
    return qs ? `${path}?${qs}` : path;
}
