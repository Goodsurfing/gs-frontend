import type { Locale } from "@/i18n/config";

import { routes } from "./routes";

/**
 * Страницы под реальный спрос (GS-280), только по-русски: «Волонтёрство зимой» и «Как Workaway,
 * но в России». Ссылки на них — в «Ещё направления» (категории, посадочные) и подсказкой в каталоге,
 * когда ищут «зима…» или «workaway» (зима — самый частый запрос во внутреннем поиске).
 */
export const SPECIAL_LANDINGS = [
    { key: "winter", title: "Волонтёрство зимой", href: routes.winterVolunteering, match: /зим/i },
    { key: "workaway", title: "Как Workaway, но в России", href: routes.workawayRussia, match: /workaway|воркэвэ|воркавэ|воркавей|воркэвей/i },
] as const;

export function specialLandingLinks(locale: Locale): { title: string; href: string }[] {
    return locale === "ru" ? SPECIAL_LANDINGS.map((item) => ({ title: item.title, href: item.href(locale) })) : [];
}

/** Подсказка над результатами поиска в каталоге; только по-русски */
export function searchLandingHint(search: string, locale: Locale | string): { title: string; href: string } | null {
    if (locale !== "ru" || !search.trim()) return null;
    const item = SPECIAL_LANDINGS.find((landing) => landing.match.test(search));
    return item ? { title: item.title, href: item.href("ru") } : null;
}
