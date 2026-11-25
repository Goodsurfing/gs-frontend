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

export interface QuickPick {
    label: string;
    href: string;
}

/**
 * Подборки под поиском на телефоне — две строки на ширине 390: зима (запрос №1 во внутреннем
 * поиске), экспедиции и регионы с наибольшим числом вакансий; остальные — на «Все направления».
 */
const RU_QUICK_PICKS = ["expeditions", "karelia", "crimea", "baikal", "altai"] as const;

const QUICK_HUB_LABEL: Record<Locale, string> = { ru: "Все направления", en: "All categories", es: "Todas las categorías" };

/**
 * Быстрые подборки под строкой поиска на первом экране главной на телефоне (GS-292) — только
 * существующие посадочные страницы. По-русски: «Зимой», экспедиции и регионы, все направления. На en/es посадочных тем нет — направления из плиток главной (каталог с фильтром),
 * для en ещё «Volunteer in Russia».
 */
export function homeQuickPicks(locale: Locale, categories: { id: number; name: string }[] = []): QuickPick[] {
    const hub = { label: QUICK_HUB_LABEL[locale], href: routes.volunteeringHub(locale) };
    if (locale === "ru") {
        const topics = RU_QUICK_PICKS.flatMap((slug) => {
            const item = TOPIC_LANDINGS.find((landing) => landing.slug === slug);
            return item ? [{ label: item.name, href: routes.volunteering(locale, item.slug) }] : [];
        });
        return [{ label: "Зимой", href: routes.winterVolunteering(locale) }, ...topics, hub];
    }
    const picks = categories.slice(0, 5).map((category) => ({ label: category.name, href: routes.offersMapCategory(locale, category.id) }));
    if (locale === "en") picks.unshift({ label: "Volunteer in Russia", href: routes.volunteerInRussia(locale) });
    return [...picks, hub];
}
