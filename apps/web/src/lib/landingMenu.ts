import type { Locale } from "@/i18n/config";

import { routes } from "./routes";
import { specialLandingLinks } from "./specialLandings";
import { TOPIC_LANDINGS } from "./topicLandings";

export interface LandingMenuLink {
    label: string;
    href: string;
}

const HUB_LABEL: Record<Locale, string> = { ru: "Все направления", en: "All categories", es: "Todas las categorías" };

/**
 * Посадочные страницы в подвале — колонка «Куда поехать» (решение владельца 24.11.2026: все страницы,
 * в шапку не выносим). Страницы тем, регионов и подборок есть только по-русски; en — общая страница и
 * «Volunteer in Russia»; es — только общая. Направления (ферма, хостел…) — на общей странице.
 */
export function landingMenuLinks(locale: Locale): LandingMenuLink[] {
    const hub = { label: HUB_LABEL[locale], href: routes.volunteeringHub(locale) };
    if (locale === "en") return [hub, { label: "Volunteer in Russia", href: routes.volunteerInRussia(locale) }];
    if (locale !== "ru") return [hub];
    const topic = (kind: "topic" | "region") => TOPIC_LANDINGS.filter((item) => item.kind === kind)
        .map((item) => ({ label: item.name, href: routes.volunteering(locale, item.slug) }));
    const special = specialLandingLinks(locale).map((item) => ({
        label: item.href.endsWith("/winter-volunteering") ? "Зимой" : "Как Workaway, но в России",
        href: item.href,
    }));
    return [hub, ...special, ...topic("topic"), ...topic("region")];
}
