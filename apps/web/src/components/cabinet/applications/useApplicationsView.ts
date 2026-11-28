"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useSession } from "@/components/session/SessionProvider";
import {
    type ApplicationCounts,
    type ApplicationsFilter,
    applicationsFilterQuery,
    APPLICATIONS_PER_PAGE,
    type ApplicationTab,
    defaultFilter,
    parseApplicationsFilter,
} from "@/lib/applicationsView";

/** Пауза после ввода в поиске — не дёргать API на каждую букву на медленной сети */
export const SEARCH_DELAY = 400;

export type ApplicationsListState<T> =
    | { state: "loading" }
    | { state: "error" }
    | { state: "ready"; items: T[]; total: number };

/** Ответ списка: null — не загрузилось (покажем «Повторить») */
export type LoadApplications<T> = (token: string | undefined, filter: ApplicationsFilter) => Promise<{ items: T[]; total: number } | null>;
/** Числа во вкладках: null — нет (старый бэкенд), вкладки без чисел */
export type LoadApplicationCounts = (token: string | undefined, filter: Pick<ApplicationsFilter, "search" | "vacancyId">) => Promise<ApplicationCounts | null>;

/**
 * Список заявок с вкладками по статусу, поиском и числами с сервера — общее
 * для «Заявок» организатора (GS-331) и «Моих заявок» волонтёра (GS-332).
 * Фильтры — в адресе (?status=&q=&vacancy=&page=): «Назад» из переписки
 * возвращает туда же. Поиск уходит после паузы в наборе; поздний ответ для
 * прежних фильтров не затирает свежий.
 */
export function useApplicationsView<T>({ defaultTab, loadList, loadCounts, emptyTabFallback }: {
    defaultTab: ApplicationTab;
    loadList: LoadApplications<T>;
    loadCounts: LoadApplicationCounts;
    /** Вкладка не задана в адресе и в ней пусто, а заявки есть — открыть «Все» (у организатора — когда новых нет) */
    emptyTabFallback?: boolean;
}) {
    const session = useSession();
    const [filter, setFilter] = useState<ApplicationsFilter | null>(null);
    const [searchText, setSearchText] = useState("");
    const [list, setList] = useState<ApplicationsListState<T>>({ state: "loading" });
    const [counts, setCounts] = useState<ApplicationCounts | null>(null);
    const [reloadKey, setReloadKey] = useState(0);
    const autoTab = useRef(false);
    // Загрузчики — свежие с каждой отрисовки, но эффекты от них не зависят
    const loaders = useRef({ loadList, loadCounts });
    useEffect(() => {
        loaders.current = { loadList, loadCounts };
    });

    // Фильтры из адреса — один раз в браузере (страница кабинета, на сервере адреса запроса нет)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const initial = parseApplicationsFilter(params, defaultTab);
        autoTab.current = !!emptyTabFallback && !params.has("status");
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFilter(initial);
        setSearchText(initial.search);
    }, [defaultTab, emptyTabFallback]);

    // Фильтры — обратно в адрес, без новой записи в истории
    useEffect(() => {
        if (!filter) return;
        const url = `${window.location.pathname}${applicationsFilterQuery(filter, defaultTab)}${window.location.hash}`;
        if (url !== `${window.location.pathname}${window.location.search}${window.location.hash}`) window.history.replaceState(window.history.state, "", url);
    }, [filter, defaultTab]);

    // Поиск — с паузой после ввода
    useEffect(() => {
        if (!filter || searchText === filter.search) return;
        const timer = window.setTimeout(() => setFilter((prev) => prev && { ...prev, search: searchText, page: 1 }), SEARCH_DELAY);
        return () => window.clearTimeout(timer);
    }, [searchText, filter]);

    const listRequest = useRef(0);
    useEffect(() => {
        if (session.status !== "user" || !filter) return;
        const request = ++listRequest.current;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setList({ state: "loading" });
        loaders.current.loadList(session.token, filter)
            .then((data) => {
                if (listRequest.current !== request) return;
                if (!data) {
                    setList({ state: "error" });
                    return;
                }
                const pages = Math.max(1, Math.ceil(data.total / APPLICATIONS_PER_PAGE));
                // Ушла последняя карточка последней страницы — на предыдущую
                if (filter.page > pages) {
                    setFilter((prev) => prev && { ...prev, page: pages });
                    return;
                }
                setList({ state: "ready", items: data.items, total: data.total });
            })
            .catch(() => listRequest.current === request && setList({ state: "error" }));
    }, [session.status, session.token, filter, reloadKey]);

    // Числа во вкладках зависят только от поиска и вакансии
    const countsRequest = useRef(0);
    const countsVacancy = filter?.vacancyId;
    const countsSearch = filter?.search.trim();
    const countsReady = !!filter;
    useEffect(() => {
        if (session.status !== "user" || !countsReady) return;
        const request = ++countsRequest.current;
        loaders.current.loadCounts(session.token, { search: countsSearch ?? "", vacancyId: countsVacancy })
            .then((data) => {
                if (countsRequest.current !== request) return;
                setCounts(data);
                if (autoTab.current) {
                    autoTab.current = false;
                    if (data && data[defaultTab] === 0 && data.all > 0) setFilter((prev) => prev && prev.tab === defaultTab ? { ...prev, tab: "all", page: 1 } : prev);
                }
            })
            .catch(() => countsRequest.current === request && setCounts(null));
    }, [session.status, session.token, countsReady, countsVacancy, countsSearch, reloadKey, defaultTab]);

    const reload = useCallback(() => setReloadKey((key) => key + 1), []);
    const update = useCallback((patch: Partial<ApplicationsFilter>) => {
        autoTab.current = false;
        setFilter((prev) => ({ ...(prev ?? defaultFilter(defaultTab)), page: 1, ...patch }));
    }, [defaultTab]);
    const resetSearch = useCallback((patch: Partial<ApplicationsFilter> = {}) => {
        setSearchText("");
        update({ search: "", ...patch });
    }, [update]);

    // Сужено поиском или вакансией — «по этим условиям заявок нет»; пустая вкладка при заявках в других — тоже
    const narrowed = !!filter && (!!filter.search.trim() || !!filter.vacancyId);
    const filtered = narrowed || (!!filter && filter.tab !== "all" && (counts?.all ?? 0) > 0);
    const pages = list.state === "ready" ? Math.ceil(list.total / APPLICATIONS_PER_PAGE) : 0;

    return { filter, searchText, setSearchText, list, counts, reload, update, resetSearch, narrowed, filtered, pages };
}
