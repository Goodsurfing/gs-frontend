"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { Pagination } from "@/components/list/Pagination";
import { Chip, DropdownButton } from "@/components/offers-map/OffersFilterBar";
import { OffersMap, type OffersMapLabels } from "@/components/offers-map/OffersMap";
import type { DonationListItem } from "@/lib/donationsCatalog";
import { type DonationsFilters, donationsFiltersQuery, DONATIONS_PER_PAGE } from "@/lib/donationsFilters";
import { textSlice } from "@/lib/textSlice";

export interface DonationsCatalogLabels {
    count: string;
    sortLabel: string;
    sortUrgency: string;
    sortPopular: string;
    backToMap: string;
    hideMap: string;
    search: string;
    searchLabel: string;
    notFound: string;
    loadError: string;
    retry: string;
    categories: string;
    showClosed: string;
    onlySuccess: string;
    apply: string;
    reset: string;
    successBadge: string;
    collected: string;
    projectCollected: string;
    left: string;
    pagination: { prev: string; next: string; page: string };
    tabs: { list: string; map: string; filter: string };
    map: OffersMapLabels;
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (value: boolean) => void; label: string }) {
    return (
        <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className="flex cursor-pointer items-center gap-2.5 text-[14px] leading-[1.5] font-medium text-ink-secondary">
            {label}
            <span className={`relative h-3.5 w-[34px] shrink-0 rounded-full transition-colors ${checked ? "bg-primary/50" : "bg-black/38"}`}>
                <span className={`absolute -top-[3px] h-5 w-5 rounded-full shadow-[0_2px_1px_-1px_rgba(0,0,0,0.2),0_1px_1px_0_rgba(0,0,0,0.14),0_1px_3px_0_rgba(0,0,0,0.12)] transition-[left] ${checked ? "left-[14px] bg-primary" : "left-0 bg-white"}`} />
            </span>
        </button>
    );
}

/** Карточка сбора в списке (DonationCard старого фронта): вся карточка ведёт на страницу сбора */
function DonationCard({ item, href, wide, labels }: { item: DonationListItem; href: string; wide: boolean; labels: DonationsCatalogLabels }) {
    return (
        <a href={href} className={`flex h-fit items-start gap-3.5 border-b border-accent-bg bg-white p-2.5 text-inherit no-underline shadow-[0_5px_20px_0_#2121210d] down-xs:flex-wrap down-xs:p-4 ${wide ? "w-1/2 down-2xl:w-full" : "w-full"}`}>
            <div className="relative h-[140px] w-[180px] shrink-0 down-xs:h-[180px] down-xs:w-full">
                {item.image
                    // eslint-disable-next-line @next/next/no-img-element -- обложка из хранилища
                    ? <img src={item.image} alt="donation-img" loading="lazy" className="h-full w-full object-cover" />
                    : <div className="h-full w-full bg-accent-bg" />}
                {item.success && <div className="absolute top-2.5 left-2.5 rounded-[40px] bg-cta px-1.5 py-1 text-[10px] leading-none text-white uppercase">{labels.successBadge}</div>}
            </div>
            <div className="w-full">
                <div className={`mb-2 h-[5px] overflow-hidden rounded-[2.5px] ${item.success ? "bg-[#21212126]" : "bg-[#3CABF740]"}`}>
                    <div className={`h-full rounded-[2.5px] ${item.success ? "bg-caption" : "bg-primary"}`} style={{ width: `${Math.min(100, item.percent)}%` }} />
                </div>
                <p className="text-[1.125rem] leading-[22px] font-medium text-ink-secondary">{textSlice(item.title, 50, "title")}</p>
                <div className="mt-2 text-[14px] leading-5 font-medium text-caption down-xs:flex down-xs:flex-col">
                    <p>{textSlice(item.organization, 25, "none")}</p>
                    <p className="mt-2 max-w-[300px] leading-[17px] text-ink-secondary opacity-50">{textSlice(item.description, 50, "description")}</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-4 down-xs:gap-2">
                    {item.success ? (
                        <span className="flex items-center gap-1.5 text-[14px] leading-none">
                            {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                            <img src="/web/icons/donation/check.svg" alt="check" />{labels.projectCollected} {item.percent} %
                        </span>
                    ) : (
                        <>
                            <span className="flex items-center gap-1.5 text-[14px] leading-none">
                                {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                                <img src="/web/icons/donation/flag.svg" alt="flag" />{labels.collected} {item.percent} %
                            </span>
                            {item.daysLeft !== null && (
                                <span className="flex items-center gap-1.5 text-[14px] leading-none">
                                    {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                                    <img src="/web/icons/donation/calendar.svg" alt="calendar" />{labels.left} {item.daysLeft}
                                </span>
                            )}
                        </>
                    )}
                </div>
            </div>
        </a>
    );
}

type MobileTab = "list" | "map" | "filter";

/**
 * Каталог сборов (DonationsMapPage старого фронта): фильтры сверху, слева
 * поиск, счётчик, сортировка, список и страницы; справа карта сборов (та же
 * карта, что у каталога вакансий). Всё — в адресе, список рендерит сервер.
 */
export function DonationsCatalog({ locale, basePath, filters, page, categories, fundraiseHref, labels }: {
    locale: string;
    basePath: string;
    filters: DonationsFilters;
    /** null — список не загрузился */
    page: { items: DonationListItem[]; total: number } | null;
    categories: { id: number; name: string; color: string }[];
    /** Адрес сбора с {id} */
    fundraiseHref: string;
    labels: DonationsCatalogLabels;
}) {
    const router = useRouter();
    const [mapOpen, setMapOpen] = useState(true);
    const [tab, setTab] = useState<MobileTab>("list");
    const [search, setSearch] = useState(filters.search);
    const [draft, setDraft] = useState({ category: filters.category, closed: filters.closed, success: filters.success });
    const [categoriesOpen, setCategoriesOpen] = useState(false);

    const href = useCallback((change: Partial<DonationsFilters>) => {
        const query = donationsFiltersQuery({ ...filters, fundraiseId: undefined, ...change });
        return query ? `${basePath}?${query}` : basePath;
    }, [basePath, filters]);
    const apply = () => {
        setCategoriesOpen(false);
        setTab("list");
        router.push(href({ ...draft, page: 1 }));
    };
    const reset = () => {
        setDraft({ category: undefined, closed: false, success: false });
        setSearch("");
        setCategoriesOpen(false);
        router.push(basePath);
    };

    const mapQuery = donationsFiltersQuery({ ...filters, page: undefined, fundraiseId: undefined, sort: undefined });
    const pages = page ? Math.max(1, Math.ceil(page.total / DONATIONS_PER_PAGE)) : 1;

    const filterBar = (stacked: boolean) => (
        <div className={`flex bg-white ${stacked ? "flex-col gap-4 px-5 py-[15px]" : "flex-wrap items-center gap-2.5 border-b border-accent-bg px-[50px] py-5"}`}>
            <div className={`relative flex flex-col ${stacked ? "" : "mr-5"}`}>
                <DropdownButton label={labels.categories} active={draft.category !== undefined} open={categoriesOpen} onClick={() => setCategoriesOpen(!categoriesOpen)} minWidth={stacked ? "w-full" : "min-w-[260px]"} />
                {categoriesOpen && (
                    <div className={`z-[4] bg-white px-[15px] py-[17px] shadow-[0_4px_6px_0_rgba(0,0,0,0.1)] ${stacked ? "w-full" : "absolute top-full left-0 w-max max-w-[420px]"}`}>
                        <div className="flex flex-wrap gap-2.5">
                            {categories.map((category) => (
                                <Chip
                                    key={category.id}
                                    color={category.color || "#3dabf7"}
                                    selected={draft.category === category.id}
                                    onClick={() => setDraft((current) => ({ ...current, category: current.category === category.id ? undefined : category.id }))}
                                >
                                    {category.name}
                                </Chip>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <Toggle checked={draft.closed} onChange={(closed) => setDraft((current) => ({ ...current, closed }))} label={labels.showClosed} />
            <Toggle checked={draft.success} onChange={(success) => setDraft((current) => ({ ...current, success }))} label={labels.onlySuccess} />
            <div className={stacked ? "flex gap-2.5" : "ml-auto flex gap-2.5"}>
                <button type="button" onClick={apply} className="cursor-pointer rounded-[10px] border border-primary bg-primary px-3 py-2.5 text-[14px] text-white transition-colors hover:bg-white hover:text-primary">{labels.apply}</button>
                <button type="button" onClick={reset} className="cursor-pointer rounded-[10px] px-3 py-2.5 text-[14px] text-primary transition-colors hover:text-primary-hover">{labels.reset}</button>
            </div>
        </div>
    );
    const tabButton = (name: MobileTab, text: string) => (
        <button
            type="button"
            aria-pressed={tab === name}
            onClick={() => setTab(name)}
            className={`flex w-full cursor-pointer items-center justify-center gap-2 border border-field px-[35px] py-2.5 ${tab === name ? "bg-primary text-white" : "bg-white text-ink-secondary"}`}
        >
            {text}
        </button>
    );
    const sortSelect = (className: string) => (
        <select
            aria-label={labels.sortLabel}
            value={filters.sort}
            onChange={(event) => router.push(href({ sort: event.target.value as DonationsFilters["sort"], page: 1 }))}
            className={`cursor-pointer border border-caption bg-white px-3.5 text-[16px] ${className}`}
        >
            <option value="urgency">{labels.sortUrgency}</option>
            <option value="popular">{labels.sortPopular}</option>
        </select>
    );

    return (
        <>
            <div className="down-lg:hidden">{filterBar(false)}</div>
            <div className="hidden flex-col gap-2.5 px-5 py-[15px] down-lg:flex">
                {tabButton("list", labels.tabs.list)}
                <div className="flex justify-between gap-2.5">
                    {tabButton("map", labels.tabs.map)}
                    {tabButton("filter", labels.tabs.filter)}
                </div>
                {tab === "list" && sortSelect("h-10 w-full")}
            </div>
            {tab === "filter" && <div className="hidden down-lg:block">{filterBar(true)}</div>}

            <div className="flex">
                <div className={`flex h-[calc(100vh-258px)] min-w-0 flex-1 flex-col down-lg:h-auto ${mapOpen ? "max-w-[1000px] down-lg:max-w-none" : "max-w-full"} ${tab === "list" ? "" : "down-lg:hidden"}`}>
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
                        <div className="contents down-lg:hidden">{sortSelect("h-10 w-[200px]")}</div>
                        {!mapOpen && (
                            <button type="button" onClick={() => setMapOpen(true)} className="ml-auto cursor-pointer font-medium text-primary down-lg:hidden">{labels.backToMap}</button>
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
                                <button type="button" onClick={() => router.refresh()} className="mt-2 cursor-pointer rounded-[10px] border border-primary px-[100px] py-3 text-label text-primary hover:bg-primary hover:text-white">{labels.retry}</button>
                            </div>
                        )}
                        {page?.items.length === 0 && <p className="w-full p-5 text-center text-[14px] font-medium">{labels.notFound}</p>}
                        {page?.items.map((item) => (
                            <DonationCard key={item.id} item={item} href={fundraiseHref.replace("{id}", item.id)} wide={!mapOpen} labels={labels} />
                        ))}
                    </div>

                    <div className="flex justify-center">
                        <Pagination page={filters.page} count={pages} href={(target) => href({ page: target })} labels={labels.pagination} />
                    </div>
                </div>

                {(mapOpen || tab === "map") && (
                    <div className={`relative mr-2.5 flex h-[calc(100vh-258px)] min-w-0 flex-1 down-lg:mr-0 down-lg:h-[calc(100vh-14rem)] ${tab === "map" ? "" : "down-lg:hidden"} ${mapOpen ? "" : "min-[993px]:hidden"}`}>
                        <OffersMap locale={locale} filtersQuery={mapQuery} offerHref={fundraiseHref} pointsUrl="/web/api/map-fundraises" labels={labels.map} />
                    </div>
                )}
            </div>
        </>
    );
}
