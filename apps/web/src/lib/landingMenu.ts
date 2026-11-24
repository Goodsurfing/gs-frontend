import type { Locale } from "@/i18n/config";

import { routes } from "./routes";

export interface LandingMenuLink {
    label: string;
    href: string;
}

const HUB_LABEL: Record<Locale, string> = { ru: "Все направления", en: "All categories", es: "Todas las categorías" };

/**
 * Посадочные страницы в подвале («Куда поехать», в шапку не выносим — решение владельца 24.11).
 * Ссылок немного, чтобы колонка не была выше «О проекте» и подвал не рос: общая страница,
 * «зимой», экспедиции и регионы (якорь на разделе общей страницы). Страницы тем и регионов
 * есть только по-русски; en — общая страница и «Volunteer in Russia»; es — только общая.
 */
export function landingMenuLinks(locale: Locale): LandingMenuLink[] {
    const hub = { label: HUB_LABEL[locale], href: routes.volunteeringHub(locale) };
    if (locale === "en") return [hub, { label: "Volunteer in Russia", href: routes.volunteerInRussia(locale) }];
    if (locale !== "ru") return [hub];
    return [
        hub,
        { label: "Зимой", href: routes.winterVolunteering(locale) },
        { label: "Экспедиции", href: routes.volunteering(locale, "expeditions") },
        { label: "По регионам", href: `${routes.volunteeringHub(locale)}#hub-regions` },
    ];
}
