"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

import { Pagination } from "@/components/list/Pagination";
import { useSession } from "@/components/session/SessionProvider";
import { Toast } from "@/components/ui/Toast";
import { browserApi } from "@/lib/browserApi";
import {
    APPLICATION_TABS,
    APPLICATIONS_PER_PAGE,
    type ApplicationCounts,
    type ApplicationsFilter,
    type ApplicationTab,
    applicationsFilterQuery,
    applicationsListQuery,
    DEFAULT_FILTER,
    parseApplicationsFilter,
    type PluralText,
} from "@/lib/hostApplicationsView";

import { type Application, ApplicationCard, type ApplicationCardLabels } from "./ApplicationCard";
import { HostReviewDialog, type HostReviewDialogLabels } from "./HostReviewDialog";
import { NewApplicationsBanner } from "./NewApplicationsBanner";
import { useApplicationStatus } from "./useApplicationStatus";

/** Пауза после ввода в поиске — не дёргать API на каждую букву на медленной сети */
const SEARCH_DELAY = 400;

export interface HostNotesLabels {
    search: string;
    searchPlaceholder: string;
    clearSearch: string;
    vacancy: string;
    allVacancies: string;
    untitled: string;
    tabs: Record<ApplicationTab, string>;
    waiting: PluralText;
    reply: string;
    loadError: string;
    retry: string;
    empty: string;
    emptyFiltered: string;
    resetFilters: string;
    statusError: string;
    reviewTitle: string;
    pages: { prev: string; next: string; page: string };
    card: ApplicationCardLabels;
    dialog: HostReviewDialogLabels;
}

type ListState =
    | { state: "loading" }
    | { state: "error" }
    | { state: "ready"; items: Application[]; total: number };

/**
 * «Заявки» организатора (GS-331, раздел 4.10): поиск по имени волонтёра,
 * выбор вакансии, вкладки «Новые / Приняты / Отклонены / Все» с числами
 * с сервера, карточки с текстом отклика и постраничная навигация. Фильтры —
 * в адресе (?status=&q=&vacancy=&page=): ссылка с рабочего стола и «Назад»
 * из переписки возвращают туда же.
 */
export function HostNotes({ locale, routes, labels }: {
    locale: string;
    routes: { volunteer: string; offer: string; chat: string };
    labels: HostNotesLabels;
}) {
    const session = useSession();
    const hostId = (session.profile as { hostId?: string | null } | null)?.hostId ?? null;
    const [filter, setFilter] = useState<ApplicationsFilter | null>(null);
    const [searchText, setSearchText] = useState("");
    const [vacancies, setVacancies] = useState<{ id: number; title: string }[]>([]);
    const [list, setList] = useState<ListState>({ state: "loading" });
    const [counts, setCounts] = useState<ApplicationCounts | null>(null);
    const [review, setReview] = useState<Application | null>(null);
    const [reloadKey, setReloadKey] = useState(0);
    const searchId = useId();
    const selectId = useId();
    const listTop = useRef<HTMLDivElement>(null);
    /** Вкладка не задана в адресе — если новых нет, показать «Все», а не пустую «Новые» */
    const autoTab = useRef(false);

    // Фильтры из адреса — один раз в браузере (страница кабинета, на сервере адреса запроса нет)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const initial = parseApplicationsFilter(params);
        autoTab.current = !params.has("status");
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFilter(initial);
        setSearchText(initial.search);
    }, []);

    // Фильтры — обратно в адрес, без новой записи в истории
    useEffect(() => {
        if (!filter) return;
        const url = `${window.location.pathname}${applicationsFilterQuery(filter)}${window.location.hash}`;
        if (url !== `${window.location.pathname}${window.location.search}${window.location.hash}`) window.history.replaceState(window.history.state, "", url);
    }, [filter]);

    // Поиск — с паузой после ввода
    useEffect(() => {
        if (!filter || searchText === filter.search) return;
        const timer = window.setTimeout(() => setFilter((prev) => prev && { ...prev, search: searchText, page: 1 }), SEARCH_DELAY);
        return () => window.clearTimeout(timer);
    }, [searchText, filter]);

    // Номер запроса: поздний ответ для прежних фильтров не затирает свежий
    const listRequest = useRef(0);
    useEffect(() => {
        if (session.status !== "user" || !filter) return;
        const request = ++listRequest.current;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setList({ state: "loading" });
        browserApi(session.token).GET("/api/v1/application/list-of-organization", { params: { query: applicationsListQuery(filter) } })
            .then(({ data, error }) => {
                if (listRequest.current !== request) return;
                if (error || !data) {
                    setList({ state: "error" });
                    return;
                }
                const total = data.pagination?.total ?? 0;
                const pages = Math.max(1, Math.ceil(total / APPLICATIONS_PER_PAGE));
                // Ушла последняя карточка последней страницы — на предыдущую
                if (filter.page > pages) {
                    setFilter((prev) => prev && { ...prev, page: pages });
                    return;
                }
                setList({ state: "ready", items: data.data ?? [], total });
            })
            .catch(() => listRequest.current === request && setList({ state: "error" }));
    }, [session.status, session.token, filter, reloadKey]);

    // Числа во вкладках зависят только от вакансии и поиска
    const countsRequest = useRef(0);
    const countsVacancy = filter?.vacancyId;
    const countsSearch = filter?.search.trim();
    const countsReady = !!filter;
    useEffect(() => {
        if (session.status !== "user" || !countsReady) return;
        const request = ++countsRequest.current;
        browserApi(session.token).GET("/api/v1/application/list-of-organization/counts", {
            params: { query: { ...(countsVacancy ? { vacancyId: countsVacancy } : {}), ...(countsSearch ? { search: countsSearch } : {}) } },
        })
            .then(({ data }) => {
                if (countsRequest.current !== request) return;
                setCounts(data ? { new: data.new, accepted: data.accepted, canceled: data.canceled, all: data.all } : null);
                if (autoTab.current) {
                    autoTab.current = false;
                    if (data && data.new === 0 && data.all > 0) setFilter((prev) => prev && prev.tab === "new" ? { ...prev, tab: "all", page: 1 } : prev);
                }
            })
            .catch(() => countsRequest.current === request && setCounts(null));
    }, [session.status, session.token, countsReady, countsVacancy, countsSearch, reloadKey]);

    useEffect(() => {
        if (!hostId) return;
        // Вакансии для фильтра: открытые и закрытые, без черновиков; первые 100
        void browserApi(session.token).GET("/api/v1/vacancy/list/{organizationId}", {
            params: { path: { organizationId: hostId }, query: { limit: 100, page: 1, "statuses[]": ["active", "disabled"] } },
        }).then(({ data }) => setVacancies((data?.data ?? []).map((item) => ({ id: item.id, title: item.title })))).catch(() => undefined);
    }, [hostId, session.token]);

    const reload = useCallback(() => setReloadKey((key) => key + 1), []);
    const status = useApplicationStatus(reload, labels.statusError);
    const update = (patch: Partial<ApplicationsFilter>) => {
        autoTab.current = false;
        setFilter((prev) => ({ ...(prev ?? DEFAULT_FILTER), page: 1, ...patch }));
    };
    const goToPage = (page: number) => {
        update({ page });
        listTop.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    };
    const filtered = !!filter && (!!filter.search.trim() || !!filter.vacancyId || filter.tab !== "all");
    const pages = list.state === "ready" ? Math.ceil(list.total / APPLICATIONS_PER_PAGE) : 0;
    const tabsId = useId();

    return (
        <div className="flex w-full max-w-[1100px] flex-col gap-5">
            <Toast text={status.error} onClose={status.clearError} />
            {filter && filter.tab !== "new" && (
                <NewApplicationsBanner locale={locale} count={counts?.new ?? 0} forms={labels.waiting} action={labels.reply} onAction={() => update({ tab: "new" })} />
            )}
            <div className="flex gap-3 down-md:flex-col">
                <div className="relative flex-1">
                    <label htmlFor={searchId} className="sr-only">{labels.search}</label>
                    <svg aria-hidden viewBox="0 0 24 24" className="pointer-events-none absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 fill-none stroke-caption" strokeWidth="2" strokeLinecap="round">
                        <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
                    </svg>
                    <input
                        id={searchId}
                        type="search"
                        value={searchText}
                        maxLength={100}
                        autoComplete="off"
                        enterKeyHint="search"
                        placeholder={labels.searchPlaceholder}
                        onChange={(event) => setSearchText(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") update({ search: searchText });
                        }}
                        className="box-border h-[50px] w-full rounded-[0.625rem] border border-muted bg-white py-3.5 pr-11 pl-11 text-[1rem] outline-none focus:border-primary [&::-webkit-search-cancel-button]:hidden"
                    />
                    {searchText && (
                        <button
                            type="button"
                            aria-label={labels.clearSearch}
                            onClick={() => {
                                setSearchText("");
                                update({ search: "" });
                            }}
                            className="absolute top-1/2 right-2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-caption hover:bg-field"
                        >
                            <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
                        </button>
                    )}
                </div>
                <div className="relative w-[320px] down-md:w-full">
                    <label htmlFor={selectId} className="sr-only">{labels.vacancy}</label>
                    <select
                        id={selectId}
                        value={filter?.vacancyId ?? ""}
                        onChange={(event) => update({ vacancyId: event.target.value ? Number(event.target.value) : undefined })}
                        className="box-border h-[50px] w-full cursor-pointer appearance-none truncate rounded-[0.625rem] border border-muted bg-white p-3.5 pr-10 text-[1rem] outline-none focus:border-primary"
                    >
                        <option value="">{labels.allVacancies}</option>
                        {vacancies.map((vacancy) => <option key={vacancy.id} value={vacancy.id}>{vacancy.title || labels.untitled}</option>)}
                    </select>
                    <svg aria-hidden width="20" height="20" viewBox="0 0 20 20" className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 fill-muted">
                        <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z" />
                    </svg>
                </div>
            </div>
            {/* На телефоне 4 вкладки не влезают — прокручиваются вбок */}
            <div ref={listTop} role="tablist" aria-label={labels.vacancy} className="-mx-1 flex scroll-mt-24 gap-1 overflow-x-auto border-b border-accent-bg px-1 [scrollbar-width:none]">
                {APPLICATION_TABS.map((tab) => {
                    const selected = filter?.tab === tab;
                    return (
                        <button
                            key={tab}
                            type="button"
                            role="tab"
                            id={`${tabsId}-${tab}`}
                            aria-selected={selected}
                            aria-controls={`${tabsId}-panel`}
                            onClick={() => update({ tab })}
                            className={`-mb-px flex min-h-11 shrink-0 cursor-pointer items-center gap-1.5 border-0 border-b-2 bg-transparent px-3 text-[15px] whitespace-nowrap transition-colors ${selected ? "border-primary font-semibold text-primary" : "border-transparent text-ink-secondary hover:text-primary"}`}
                        >
                            {labels.tabs[tab]}
                            {counts && (
                                <span className={`inline-flex min-w-[22px] items-center justify-center rounded-full px-1.5 text-[12px] leading-[20px] font-semibold ${selected ? "bg-primary text-white" : "bg-field text-ink-secondary"}`}>
                                    {counts[tab]}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
            <div id={`${tabsId}-panel`} role="tabpanel" aria-labelledby={filter ? `${tabsId}-${filter.tab}` : undefined} aria-busy={list.state === "loading"}>
                {list.state === "loading" && (
                    <div className="grid grid-cols-2 gap-4 down-lg:grid-cols-1" data-testid="applications-loading">
                        {[0, 1, 2, 3].map((index) => <div key={index} className="h-[188px] animate-pulse rounded-[12px] bg-field" />)}
                    </div>
                )}
                {list.state === "error" && (
                    <div className="flex flex-col items-center gap-3 rounded-[12px] bg-white px-4 py-10 text-center" role="alert">
                        <p className="m-0 text-ink-secondary">{labels.loadError}</p>
                        <button type="button" onClick={reload} className="min-h-11 cursor-pointer rounded-[10px] border border-primary bg-white px-6 text-[15px] text-primary hover:bg-primary hover:text-white">{labels.retry}</button>
                    </div>
                )}
                {list.state === "ready" && list.items.length === 0 && (
                    <div className="flex flex-col items-center gap-3 rounded-[12px] bg-white px-4 py-10 text-center">
                        <p className="m-0 text-ink-secondary">{filtered && counts?.all !== 0 ? labels.emptyFiltered : labels.empty}</p>
                        {(!!filter?.search.trim() || !!filter?.vacancyId) && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchText("");
                                    update({ search: "", vacancyId: undefined });
                                }}
                                className="min-h-11 cursor-pointer rounded-[10px] border border-primary bg-white px-6 text-[15px] text-primary hover:bg-primary hover:text-white"
                            >
                                {labels.resetFilters}
                            </button>
                        )}
                    </div>
                )}
                {list.state === "ready" && list.items.length > 0 && (
                    <div className="grid grid-cols-2 items-start gap-4 down-lg:grid-cols-1">
                        {list.items.map((application) => (
                            <ApplicationCard
                                key={application.id}
                                application={application}
                                routes={routes}
                                onStatus={(next) => status.change(application.id, next)}
                                onReview={() => setReview(application)}
                                labels={labels.card}
                            />
                        ))}
                    </div>
                )}
                {pages > 1 && filter && (
                    <div className="flex justify-center py-5">
                        <Pagination page={filter.page} count={pages} onPage={goToPage} labels={labels.pages} />
                    </div>
                )}
            </div>
            <HostReviewDialog
                volunteer={review && { vacancyId: review.vacancy.id, volunteerId: review.volunteer.id, firstName: review.volunteer.firstName, lastName: review.volunteer.lastName, image: review.volunteer.image, country: review.volunteer.country, city: review.volunteer.city, status: review.status }}
                volunteerHref={review ? routes.volunteer.replace("{id}", review.volunteer.id) : ""}
                title={labels.reviewTitle}
                photos={false}
                onClose={() => setReview(null)}
                onSent={reload}
                labels={labels.dialog}
            />
        </div>
    );
}
