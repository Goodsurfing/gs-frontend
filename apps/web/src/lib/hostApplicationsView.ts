/**
 * Заявки организатора (GS-331): вкладки, состояние фильтров в адресе и
 * подписи с числом. Без React и без server-only — общее для страницы
 * «Заявки», рабочего стола и тестов.
 */

export type ApplicationTab = "new" | "accepted" | "canceled" | "all";

/** Порядок вкладок: «Новые» первыми — это то, что ждёт ответа */
export const APPLICATION_TABS: readonly ApplicationTab[] = ["new", "accepted", "canceled", "all"];

export const APPLICATIONS_PER_PAGE = 10;

/** Числа во вкладках — ответ GET /application/list-of-organization/counts */
export type ApplicationCounts = Record<ApplicationTab, number>;

export interface ApplicationsFilter {
    tab: ApplicationTab;
    search: string;
    vacancyId?: number;
    page: number;
}

export const DEFAULT_FILTER: ApplicationsFilter = { tab: "new", search: "", page: 1 };

/** Фильтры из адреса (?status=new&q=анна&vacancy=12&page=2) — ссылка «Ответить» с рабочего стола и «Назад» из переписки */
export function parseApplicationsFilter(params: URLSearchParams): ApplicationsFilter {
    const status = params.get("status");
    const tab = APPLICATION_TABS.find((item) => item === status) ?? DEFAULT_FILTER.tab;
    const vacancy = Number(params.get("vacancy"));
    const page = Number(params.get("page"));
    return {
        tab,
        search: (params.get("q") ?? "").slice(0, 100),
        vacancyId: Number.isInteger(vacancy) && vacancy > 0 ? vacancy : undefined,
        page: Number.isInteger(page) && page > 1 ? page : 1,
    };
}

/** Обратно в строку адреса: значения по умолчанию не пишем, чтобы адрес оставался коротким */
export function applicationsFilterQuery(filter: ApplicationsFilter): string {
    const params = new URLSearchParams();
    if (filter.tab !== DEFAULT_FILTER.tab) params.set("status", filter.tab);
    const search = filter.search.trim();
    if (search) params.set("q", search);
    if (filter.vacancyId) params.set("vacancy", String(filter.vacancyId));
    if (filter.page > 1) params.set("page", String(filter.page));
    const query = params.toString();
    return query ? `?${query}` : "";
}

/** Параметры запроса списка: вкладка «Все» — без статуса */
export function applicationsListQuery(filter: ApplicationsFilter, perPage = APPLICATIONS_PER_PAGE) {
    const search = filter.search.trim();
    return {
        limit: String(perPage),
        page: String(filter.page),
        ...(filter.tab === "all" ? {} : { status: filter.tab }),
        ...(filter.vacancyId ? { vacancyId: filter.vacancyId } : {}),
        ...(search ? { search } : {}),
    };
}

/** Формы слова по числу (Intl.PluralRules): «{count}» в строке заменяется числом */
export interface PluralText { one: string; few?: string; many?: string; other: string }

export function pluralText(locale: string, count: number, forms: PluralText): string {
    const rule = new Intl.PluralRules(locale).select(count) as keyof PluralText;
    return (forms[rule] ?? forms.other).replace("{count}", String(count));
}
