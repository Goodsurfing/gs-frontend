import { parseOffersFilters } from "@/lib/offersFilters";

export interface SummaryLabels {
    all: string;
    from: string;
    to: string;
    days: string;
    kids: string;
    verified: string;
    food: string;
    housing: string;
    paidTravel: string;
    passed: string;
}

const date = (iso: string) => {
    const [y, m, d] = iso.split("-");
    return `${d}.${m}.${y}`;
};

/**
 * О чём подписка — короткими метками из адреса поиска (siteQuery): направления, даты, срок,
 * «можно с детьми» и т. д. Без фильтров — одна метка «Все вакансии».
 */
export function savedSearchSummary(siteQuery: string, categoryNames: Record<number, string>, labels: SummaryLabels): string[] {
    const f = parseOffersFilters(new URLSearchParams(siteQuery));
    const chips: string[] = [];
    if (f.search) chips.push(`«${f.search}»`);
    for (const id of f.categories) if (categoryNames[id]) chips.push(categoryNames[id]);
    if (f.from) chips.push(labels.from.replace("{{date}}", date(f.from)));
    if (f.to) chips.push(labels.to.replace("{{date}}", date(f.to)));
    if (f.minDays || f.maxDays) chips.push(labels.days.replace("{{min}}", String(f.minDays ?? 1)).replace("{{max}}", String(f.maxDays ?? "∞")));
    if (f.withChildren) chips.push(labels.kids);
    if (f.verifiedHost) chips.push(labels.verified);
    for (const item of f.provided) chips.push(labels[item]);
    if (f.languages.length) chips.push(f.languages.map((code) => code.toUpperCase()).join(", "));
    if (f.showPassed) chips.push(labels.passed);
    return chips.length ? chips : [labels.all];
}
