/**
 * Фильтры каталога вакансий (/offers-map) в адресе страницы. В старом фронте
 * в адресе жили только category, search, page и offerId — остальные фильтры
 * терялись при перезагрузке и ими нельзя было поделиться. Здесь всё в адресе;
 * старые ссылки (?category=1,2&search=…&page=…&offerId=…) работают как раньше.
 */
export type OffersSort = "novelty" | "popularity";
export type Provided = "food" | "housing" | "paidTravel";

export interface OffersFilters {
    categories: number[];
    search: string;
    page: number;
    sort: OffersSort;
    /** «Показать прошедшие» — по умолчанию включено */
    showPassed: boolean;
    /** Период участия, YYYY-MM-DD */
    from?: string;
    to?: string;
    /** Срок участия в днях; по умолчанию 1–190 (ползунок старого фронта) */
    minDays?: number;
    maxDays?: number;
    languages: string[];
    withChildren: boolean;
    provided: Provided[];
    /** Выбранная вакансия (подсвечена в списке, открыта на карте) */
    offerId?: number;
}

export const DURATION_MIN = 1;
export const DURATION_MAX = 190;
export const OFFERS_PER_PAGE = 20;

const PROVIDED: Provided[] = ["food", "housing", "paidTravel"];
const DATE = /^\d{4}-\d{2}-\d{2}$/;

type RawParams = Record<string, string | string[] | undefined> | URLSearchParams;

const getter = (params: RawParams) => (key: string): string | undefined => {
    if (params instanceof URLSearchParams) return params.get(key) ?? undefined;
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
};

const list = (value: string | undefined) => (value ?? "").split(",").map((item) => item.trim()).filter(Boolean);
const positiveInt = (value: string | undefined) => {
    const number = Number(value);
    return Number.isInteger(number) && number > 0 ? number : undefined;
};

export function parseOffersFilters(params: RawParams): OffersFilters {
    const get = getter(params);
    const minDays = positiveInt(get("minDays"));
    const maxDays = positiveInt(get("maxDays"));
    return {
        categories: list(get("category")).map(Number).filter((id) => Number.isInteger(id) && id > 0),
        search: (get("search") ?? "").trim(),
        page: positiveInt(get("page")) ?? 1,
        sort: get("sort") === "popularity" ? "popularity" : "novelty",
        showPassed: get("past") !== "0",
        from: DATE.test(get("from") ?? "") ? get("from") : undefined,
        to: DATE.test(get("to") ?? "") ? get("to") : undefined,
        minDays: minDays && minDays > DURATION_MIN ? minDays : undefined,
        maxDays: maxDays && maxDays < DURATION_MAX ? maxDays : undefined,
        languages: list(get("lang")),
        withChildren: get("kids") === "1",
        provided: list(get("provided")).filter((item): item is Provided => (PROVIDED as string[]).includes(item)),
        offerId: positiveInt(get("offerId")),
    };
}

/** Адрес каталога с фильтрами; значения по умолчанию в адрес не пишутся. */
export function offersFiltersQuery(filters: Partial<OffersFilters>): string {
    const query = new URLSearchParams();
    if (filters.categories?.length) query.set("category", filters.categories.join(","));
    if (filters.search) query.set("search", filters.search);
    if (filters.sort === "popularity") query.set("sort", "popularity");
    if (filters.showPassed === false) query.set("past", "0");
    if (filters.from) query.set("from", filters.from);
    if (filters.to) query.set("to", filters.to);
    if (filters.minDays) query.set("minDays", String(filters.minDays));
    if (filters.maxDays) query.set("maxDays", String(filters.maxDays));
    if (filters.languages?.length) query.set("lang", filters.languages.join(","));
    if (filters.withChildren) query.set("kids", "1");
    if (filters.provided?.length) query.set("provided", filters.provided.join(","));
    if (filters.page && filters.page > 1) query.set("page", String(filters.page));
    if (filters.offerId) query.set("offerId", String(filters.offerId));
    return query.toString();
}

/**
 * Параметры API для списка (GET /vacancy) и карты (GET /vacancy/for-map/list) —
 * как offersFilterApiAdapter старого фронта. Поиск в старом фронте сбрасывал
 * остальные фильтры; здесь они совместимы, бэкенд принимает их вместе.
 */
export function offersApiQuery(filters: OffersFilters) {
    const query: {
        "categoryIds[]"?: number[];
        search?: string;
        startDate?: string;
        endDate?: string;
        minDurationDays?: number;
        maxDurationDays?: string;
        "languages[]"?: string[];
        "additionalConditions[]"?: string[];
        "foodIds[]"?: number[];
        "houseIds[]"?: number[];
        "transferIds[]"?: number[];
        hidePassed?: boolean;
    } = {};
    if (filters.categories.length) query["categoryIds[]"] = filters.categories;
    if (filters.search) query.search = filters.search;
    if (filters.from) query.startDate = filters.from;
    if (filters.to) query.endDate = filters.to;
    if (filters.minDays) query.minDurationDays = filters.minDays;
    if (filters.maxDays) query.maxDurationDays = String(filters.maxDays);
    if (filters.languages.length) query["languages[]"] = filters.languages;
    if (filters.withChildren) query["additionalConditions[]"] = ["allow-kids"];
    if (filters.provided.includes("food")) query["foodIds[]"] = [1, 2, 3];
    if (filters.provided.includes("housing")) query["houseIds[]"] = [1, 2, 3, 4, 5];
    if (filters.provided.includes("paidTravel")) query["transferIds[]"] = [1, 2, 3, 4];
    if (!filters.showPassed) query.hidePassed = true;
    return query;
}
