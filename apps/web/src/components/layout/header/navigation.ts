import type { Locale } from "@/i18n/config";
import type { Translate } from "@/i18n/dictionary";
import { EXPEDITIONS_URL, INTERNATIONAL_URL, routes } from "@/lib/routes";

export interface NavLink {
    label: string;
    href: string;
}

export type NavEntry =
    | ({ kind: "link" } & NavLink)
    | { kind: "group"; label: string; items: NavLink[] };

export interface Navigation {
    /** «Все вакансии» — выделенная кнопка перед остальными пунктами */
    offers: NavLink;
    entries: NavEntry[];
}

/**
 * Пункты главного меню — одни для десктопной и мобильной шапки (в старом
 * фронте списки дублировались в двух компонентах и расходились).
 */
export function buildNavigation(locale: Locale, t: Translate): Navigation {
    const h = (key: string) => t(`main.welcome.header.${key}`);
    const link = (label: string, href: string): NavLink => ({ label, href });

    return {
        offers: link(h("offers.title"), routes.offersMap(locale)),
        entries: [
            {
                kind: "group",
                label: h("community.title"),
                items: [
                    link(h("community.blog"), routes.blog(locale)),
                    link(h("community.video"), routes.video(locale)),
                    link(h("community.ambassadors"), routes.ambassadors(locale)),
                    link(h("community.courses"), routes.academy(locale)),
                    link(h("community.journal"), routes.journals(locale)),
                ],
            },
            {
                kind: "group",
                label: h("donation.title"),
                items: [
                    link(h("donation.support-goodsurfing"), routes.membership(locale)),
                    link(h("donation.support-other-projects"), routes.donationsMap(locale)),
                    link(h("donation.public-reports"), routes.npo(locale)),
                    link(h("donation.rating-donations"), routes.donationRating(locale)),
                ],
            },
            {
                kind: "group",
                label: h("about-project.title"),
                items: [
                    link(h("about-project.news"), routes.news(locale)),
                    link(h("about-project.about-goodsurfing"), routes.aboutProject(locale)),
                    link(h("about-project.about-npo"), routes.npo(locale)),
                    link(h("about-project.our-team"), routes.ourTeam(locale)),
                    link(h("about-project.how-it-works"), routes.membership(locale)),
                    link(h("about-project.find-job"), routes.findJob(locale)),
                ],
            },
            { kind: "link", ...link(h("for-organizers.become-a-host"), routes.becomeHost(locale)) },
            { kind: "link", ...link(h("expeditions"), EXPEDITIONS_URL) },
            { kind: "link", ...link(h("international-volunteering"), INTERNATIONAL_URL) },
        ],
    };
}
