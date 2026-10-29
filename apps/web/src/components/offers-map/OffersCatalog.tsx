"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { Pagination } from "@/components/list/Pagination";
import type { CatalogPage } from "@/lib/offersCatalog";
import { type OffersFilters, offersFiltersQuery, OFFERS_PER_PAGE } from "@/lib/offersFilters";

import { type FilterBarLabels, OffersFilterBar } from "./OffersFilterBar";
import { OfferListCard, type OfferListCardLabels } from "./OfferListCard";
import { OffersMap, type OffersMapLabels } from "./OffersMap";

export interface CatalogLabels {
    count: string;
    showPassed: string;
    sortLabel: string;
    sortNovelty: string;
    sortPopularity: string;
    backToMap: string;
    hideMap: string;
    search: string;
    searchLabel: string;
    notFound: string;
    loadError: string;
    loadErrorHint: string;
    retry: string;
    pagination: { prev: string; next: string; page: string };
    card: OfferListCardLabels;
    map: OffersMapLabels;
    filters: FilterBarLabels;
    tabs: { list: string; map: string; filter: string };
}

type MobileTab = "list" | "map" | "filter";

/**
 * Каталог вакансий на десктопе: слева поиск, счётчик, «Показать прошедшие»,
 * сортировка, список и страницы; справа карта. Вакансия, выбранная в списке,
 * подсвечивается и открывается на карте; выбор пишется в адрес (?offerId=)
 * без перезагрузки — «назад» со страницы вакансии возвращает к ней же.
 * Фильтры, поиск, сортировка и страница — в адресе, список рендерит сервер.
 */
export function OffersCatalog({ locale, basePath, filters, page, offerHref, categories, languages, labels }: {
    locale: string;
    basePath: string;
    filters: OffersFilters;
    categories: { id: number; name: string; color: string }[];
    languages: { value: string; label: string }[];
    /** null — список не загрузился */
    page: CatalogPage | null;
    offerHref: string;
    labels: CatalogLabels;
}) {
    const router = useRouter();
    const [selected, setSelected] = useState<number | undefined>(filters.offerId);
    const [mapOpen, setMapOpen] = useState(true);
    const [search, setSearch] = useState(filters.search);
    // Телефон (до 992 px): список, карта и фильтр — вкладками, как в старом фронте
    const [tab, setTab] = useState<MobileTab>("list");

    const href = useCallback((change: Partial<OffersFilters>) => {
        const query = offersFiltersQuery({ ...filters, offerId: undefined, ...change });
        return query ? `${basePath}?${query}` : basePath;
    }, [basePath, filters]);

    const select = useCallback((id: number) => {
        setSelected(id);
        const query = offersFiltersQuery({ ...filters, offerId: id });
        window.history.replaceState(null, "", `${basePath}?${query}`);
    }, [basePath, filters]);

    // Карта показывает все вакансии по фильтрам, без учёта страницы списка
    const mapQuery = offersFiltersQuery({ ...filters, page: undefined, offerId: undefined });
    const pages = page ? Math.max(1, Math.ceil(page.total / OFFERS_PER_PAGE)) : 1;
    const hrefFor = (id: number) => offerHref.replace("{id}", String(id));

    const filterKey = mapQuery;
    const filterBar = (stacked: boolean) => (
        <OffersFilterBar
            key={`${stacked}-${filterKey}`}
            basePath={basePath}
            filters={filters}
            categories={categories}
            languages={languages}
            labels={labels.filters}
            stacked={stacked}
            onApplied={stacked ? () => setTab("list") : undefined}
        />
    );
    const tabButton = (name: MobileTab, text: string, icon?: boolean) => (
        <button
            type="button"
            aria-pressed={tab === name}
            onClick={() => setTab(name)}
            className={`flex w-full cursor-pointer items-center justify-center gap-2 border border-field px-[35px] py-2.5 ${tab === name ? "bg-primary text-white" : "bg-white text-ink-secondary"}`}
        >
            {text}
            {icon && (
                <svg aria-hidden width="18" height="18" viewBox="0 0 18 18" fill="none" className="stroke-current">
                    <path d="M11.2188 11.2192L16.9996 17.0001M7.1315 13.263C10.5178 13.263 13.263 10.5178 13.263 7.1315C13.263 3.74517 10.5178 1 7.1315 1C3.74517 1 1 3.74517 1 7.1315C1 10.5178 3.74517 13.263 7.1315 13.263Z" strokeWidth="2" />
                </svg>
            )}
        </button>
    );
    const sortSelect = (className: string) => (
        <select
            aria-label={labels.sortLabel}
            value={filters.sort}
            onChange={(event) => router.push(href({ sort: event.target.value as OffersFilters["sort"], page: 1 }))}
            className={`cursor-pointer border border-caption bg-white px-3.5 text-[16px] ${className}`}
        >
            <option value="popularity">{labels.sortPopularity}</option>
            <option value="novelty">{labels.sortNovelty}</option>
        </select>
    );
    const passedSwitch = (
        <a
            href={href({ showPassed: !filters.showPassed, page: 1 })}
            role="switch"
            aria-checked={filters.showPassed}
            className="flex items-center gap-2.5 text-[14px] leading-[1.5] font-medium text-ink-secondary"
        >
            <span className={`relative h-3.5 w-[34px] shrink-0 rounded-full transition-colors ${filters.showPassed ? "bg-primary/50" : "bg-black/38"}`}>
                <span className={`absolute -top-[3px] h-5 w-5 rounded-full shadow-[0_2px_1px_-1px_rgba(0,0,0,0.2),0_1px_1px_0_rgba(0,0,0,0.14),0_1px_3px_0_rgba(0,0,0,0.12)] transition-[left] ${filters.showPassed ? "left-[14px] bg-primary" : "left-0 bg-white"}`} />
            </span>
            {labels.showPassed}
        </a>
    );

    return (
        <>
        <div className="down-lg:hidden">{filterBar(false)}</div>

        <div className="hidden flex-col gap-2.5 px-5 py-[15px] down-lg:flex">
            {tabButton("list", labels.tabs.list, true)}
            <div className="flex justify-between gap-2.5">
                {tabButton("map", labels.tabs.map)}
                {tabButton("filter", labels.tabs.filter)}
            </div>
            {tab === "list" && (
                <>
                    {sortSelect("h-10 w-full")}
                    <div className="mx-auto">{passedSwitch}</div>
                </>
            )}
        </div>
        {tab === "filter" && <div className="hidden down-lg:block">{filterBar(true)}</div>}

        <div className="flex">
            <div className={`flex h-[calc(100vh-12rem)] min-w-0 flex-1 flex-col [@media(max-width:1400px)]:h-[calc(100vh-13.75rem)] down-lg:h-auto ${mapOpen ? "max-w-[1000px] down-lg:max-w-none" : "max-w-full"} ${tab === "list" ? "" : "down-lg:hidden"}`}>
                <form
                    role="search"
                    className="px-[30px] py-3 down-lg:px-5 down-lg:pt-0 down-lg:pb-[15px]"
                    onSubmit={(event) => {
                        event.preventDefault();
                        router.push(href({ search: search.trim(), page: 1 }));
                    }}
                >
                    <div className="flex items-center gap-1.5 rounded-[4px] border border-field bg-white px-1.5 py-[3px] transition-colors focus-within:border-primary">
                        <input
                            type="search"
                            name="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder={labels.search}
                            aria-label={labels.searchLabel}
                            autoComplete="off"
                            className="h-[1.4375em] min-w-0 flex-1 bg-transparent py-1 pl-0 font-[Roboto,Helvetica,Arial,sans-serif] text-[16px] text-black/87 outline-none placeholder:text-black/42 [&::-webkit-search-cancel-button]:hidden"
                        />
                        <button type="submit" aria-label={labels.searchLabel} className="flex cursor-pointer items-center justify-center p-2.5 text-black/54">
                            <svg aria-hidden width="16" height="16" viewBox="0 0 18 18" fill="transparent" className="block stroke-caption">
                                <path d="M11.2188 11.2192L16.9996 17.0001M7.1315 13.263C10.5178 13.263 13.263 10.5178 13.263 7.1315C13.263 3.74517 10.5178 1 7.1315 1C3.74517 1 1 3.74517 1 7.1315C1 10.5178 3.74517 13.263 7.1315 13.263Z" strokeWidth="2" />
                            </svg>
                        </button>
                    </div>
                </form>

                <div className="relative flex min-h-20 items-center gap-5 bg-field px-[30px] py-3 down-lg:min-h-0 down-lg:px-5">
                    <span className="text-[1.125rem] font-medium text-ink-secondary">{labels.count}</span>
                    <div className="contents down-lg:hidden">
                        {passedSwitch}
                        {sortSelect("h-[30px] w-[200px]")}
                    </div>
                    {!mapOpen && (
                        <button type="button" onClick={() => setMapOpen(true)} className="ml-auto cursor-pointer font-medium text-primary down-lg:hidden">
                            {labels.backToMap}
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => setMapOpen((open) => !open)}
                        aria-label={mapOpen ? labels.hideMap : labels.backToMap}
                        aria-expanded={mapOpen}
                        className={`z-[2] flex h-[30px] w-[30px] cursor-pointer items-center justify-center bg-field down-lg:hidden ${mapOpen ? "absolute left-full" : "relative"}`}
                    >
                        <svg aria-hidden width="18" height="8" viewBox="0 0 18 8" className={`transition-transform duration-500 ${mapOpen ? "" : "rotate-180"}`}>
                            <path fillRule="evenodd" clipRule="evenodd" d="M14 5V8L18 4L14 0V3H0V5H14Z" fill="#212121" />
                        </svg>
                    </button>
                </div>

                <div className={`flex flex-1 overflow-y-scroll down-lg:overflow-visible [&::-webkit-scrollbar]:w-2.5 [&::-webkit-scrollbar-thumb]:rounded-[10px] [&::-webkit-scrollbar-thumb]:bg-accent-bg ${mapOpen ? "flex-col" : "flex-row flex-wrap content-baseline"}`}>
                    {page === null && (
                        <div className="flex w-full flex-col items-center gap-2 p-5 text-center">
                            <p className="text-[14px] font-medium">{labels.loadError}</p>
                            <p className="text-[14px]">{labels.loadErrorHint}</p>
                            <button type="button" onClick={() => router.refresh()} className="mt-2 cursor-pointer rounded-[10px] border border-primary px-[100px] py-3 text-label text-primary hover:bg-primary hover:text-white">
                                {labels.retry}
                            </button>
                        </div>
                    )}
                    {page?.offers.length === 0 && <p className="w-full p-5 text-center text-[14px] font-medium">{labels.notFound}</p>}
                    {page?.offers.map((offer) => (
                        <OfferListCard
                            key={offer.id}
                            offer={offer}
                            href={hrefFor(offer.id)}
                            selected={offer.id === selected}
                            onSelect={select}
                            wide={!mapOpen}
                            labels={labels.card}
                        />
                    ))}
                </div>

                <div className="flex justify-center">
                    <Pagination page={filters.page} count={pages} href={(target) => href({ page: target })} labels={labels.pagination} />
                </div>
            </div>

            {(mapOpen || tab === "map") && (
                <div className={`relative mr-2.5 flex h-[calc(100vh-12rem)] min-w-0 flex-1 [@media(max-width:1400px)]:h-[calc(100vh-13.75rem)] down-lg:mr-0 down-lg:h-[calc(100vh-14rem)] ${tab === "map" ? "" : "down-lg:hidden"} ${mapOpen ? "" : "min-[993px]:hidden"}`}>
                    <OffersMap locale={locale} filtersQuery={mapQuery} selectedOfferId={selected} offerHref={offerHref} labels={labels.map} />
                </div>
            )}
        </div>
        </>
    );
}
