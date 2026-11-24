import type { Locale } from "@/i18n/config";

import { routes } from "./routes";
import { TOPIC_LANDINGS } from "./topicLandings";

export interface LandingMenuLink {
    label: string;
    href: string;
}

const HUB_LABEL: Record<Locale, string> = { ru: "Все направления", en: "All categories", es: "Todas las categorías" };

/**
 * Посадочные страницы в подвале («Куда поехать», в шапку не выносим — решение владельца 24.11). По-русски — хаб, «зимой», экспедиции,
 * регионы и конное волонтёрство (страницы тем и регионов есть только по-русски); en — хаб и
 * «Volunteer in Russia»; es — только хаб.
 */
export function landingMenuLinks(locale: Locale): LandingMenuLink[] {
    const hub = { label: HUB_LABEL[locale], href: routes.volunteeringHub(locale) };
    if (locale === "en") return [hub, { label: "Volunteer in Russia", href: routes.volunteerInRussia(locale) }];
    if (locale !== "ru") return [hub];
    const topic = (slug: string) => TOPIC_LANDINGS.filter((item) => item.slug === slug).map((item) => ({ label: item.name, href: routes.volunteering(locale, item.slug) }));
    return [
        hub,
        { label: "Зимой", href: routes.winterVolunteering(locale) },
        ...topic("expeditions"),
        ...TOPIC_LANDINGS.filter((item) => item.kind === "region").map((item) => ({ label: item.name, href: routes.volunteering(locale, item.slug) })),
        ...topic("horses"),
    ];
}
