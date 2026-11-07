import type { Locale } from "@/i18n/config";

import { seoDescription } from "./seo";

/**
 * Заголовок и описание вакансии для поисковиков (<title>, description, og).
 *
 * Название вакансии пишет организатор («Волонтёрство с видом на Байкал»,
 * «Работа в геологической экспедиции») — на странице оно остаётся как есть.
 * А в поиске люди ищут «волонтёрство в Иркутской области», «работа в хостеле
 * за проживание»: поэтому для поисковиков к названию добавляем «волонтёрство»
 * (если его нет), регион или страну и бренд, а в описание — направление,
 * условия и срок. Из поиска на страницы ~1 700 вакансий почти не приходили
 * (07.11.2026: лучшая — 19 визитов за месяц, всё остальное — по названию сайта).
 */

const BRAND: Record<Locale, string> = { ru: "Гудсёрфинг", en: "GoodSurfing", es: "GoodSurfing" };
const VOLUNTEERING: Record<Locale, string> = { ru: "волонтёрство", en: "volunteering", es: "voluntariado" };
const VOLUNTEER_WORD = /волонт|volunt/i;

/** Яндекс показывает ~70 символов заголовка, Google ~60 — длиннее обрезают */
const TITLE_LIMIT = 70;

const RUSSIA = /^(Россия|Russia|Rusia|Российская Федерация)$/i;
const REGION = /(област[ьи]|край|республика|автономн|округ|oblast|krai|republic)/i;
const FEDERAL_CITY = /^(Москва|Санкт-Петербург|Севастополь|Moscow|Saint Petersburg|St\.? Petersburg|Sevastopol)$/i;

/**
 * Где проходит вакансия — для заголовка: регион России или страна. Адрес вводят
 * по-разному («Россия, Иркутская область, Иркутск», «Ольхонский район,
 * Иркутская область, Россия, …», «Peru, Cusco, Cusco»), поэтому ищем часть-регион,
 * а для заграницы берём страну — первую часть адреса.
 */
export function offerPlace(address: string | null | undefined): string | null {
    const parts = (address ?? "").split(",").map((part) => part.trim()).filter(Boolean);
    if (parts.length === 0) return null;
    const inRussia = parts.some((part) => RUSSIA.test(part));
    const federal = parts.find((part) => FEDERAL_CITY.test(part));
    if (federal) return federal;
    // «Ольхонский район», «Орлиновский муниципальный округ» — не регион
    const region = parts.find((part) => REGION.test(part) && !/район|district|муниципальн|городской округ|поселени/i.test(part));
    if (region) return region;
    if (inRussia) return parts.find((part) => RUSSIA.test(part)) ?? null;
    // Заграница: страна идёт первой; одиночное название без страны («Поповка») — как есть
    return parts[0] ?? null;
}

export interface OfferSeoSource {
    title: string;
    address?: string | null;
    category?: string | null;
    /** Главное кратко: жильё, питание, часы, срок — то же, что плашки на странице */
    highlights: string[];
    shortDescription?: string | null;
}

export function offerSeoTitle(source: OfferSeoSource, locale: Locale): string {
    const title = source.title.trim();
    const place = offerPlace(source.address);
    const brand = ` | ${BRAND[locale]}`;
    const volunteering = VOLUNTEER_WORD.test(title) ? "" : ` — ${VOLUNTEERING[locale]}`;
    const candidates = [
        `${title}${volunteering}${place ? `, ${place}` : ""}${brand}`,
        `${title}${place ? ` — ${place}` : volunteering}${brand}`,
        `${title}${brand}`,
    ];
    return candidates.find((candidate) => candidate.length <= TITLE_LIMIT) ?? `${shorten(title, TITLE_LIMIT - brand.length)}${brand}`;
}

/** Длинное название (бывает целым предложением) — до границы слова и «…» */
function shorten(text: string, limit: number): string {
    if (text.length <= limit) return text;
    const cut = text.slice(0, limit - 1);
    const space = cut.lastIndexOf(" ");
    return `${(space > limit / 2 ? cut.slice(0, space) : cut).replace(/[\s,.;:!?—-]+$/, "")}…`;
}

export function offerSeoDescription(source: OfferSeoSource): string {
    const place = offerPlace(source.address);
    // Направление «Другое» поисковику ничего не говорит
    const category = source.category && !/^(другое|other|otro)$/i.test(source.category.trim()) ? source.category : null;
    const facts = [category, place, source.highlights.join(", ")].filter((part): part is string => !!part && part.trim() !== "");
    // «от 14 дн.» уже с точкой — вторую не ставим
    const head = facts.map((part) => part.trim().replace(/[.!?]$/, "")).join(". ");
    const sentence = head ? `${head}.` : "";
    return seoDescription([sentence, source.shortDescription ?? ""].filter(Boolean).join(" "));
}
