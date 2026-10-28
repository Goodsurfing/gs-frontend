import type { Locale } from "@/i18n/config";

/**
 * Адреса страниц — те же, что у старого фронта (src/shared/config/routes в
 * корне): ссылки, письма и закладки должны работать без изменений.
 */
const path = (locale: Locale, rest = "") => `/${locale}${rest}`;

export const routes = {
    main: (l: Locale) => path(l),
    offersMap: (l: Locale) => path(l, "/offers-map"),
    blog: (l: Locale) => path(l, "/blog"),
    video: (l: Locale) => path(l, "/video"),
    ambassadors: (l: Locale) => path(l, "/ambassadors"),
    academy: (l: Locale) => path(l, "/academy-main"),
    npo: (l: Locale) => path(l, "/npo"),
    ourTeam: (l: Locale) => path(l, "/our-team"),
    membership: (l: Locale) => path(l, "/membership"),
    rules: (l: Locale) => path(l, "/rules"),
    privacyPolicy: (l: Locale) => path(l, "/privacy-policy"),
    news: (l: Locale) => path(l, "/news"),
    aboutProject: (l: Locale) => path(l, "/about-project"),
    findJob: (l: Locale) => path(l, "/find-job"),
    feedback: (l: Locale) => path(l, "/feedback"),
    becomeHost: (l: Locale) => path(l, "/become-host"),
    paymentSecurityPolicy: (l: Locale) => path(l, "/payment-security-policy"),
    offer: (l: Locale, id: string | number) => path(l, `/offers/${id}`),
    journals: (l: Locale) => path(l, "/journals"),
    donationsMap: (l: Locale) => path(l, "/donation-map"),
    donationRating: (l: Locale) => path(l, "/donation-rating"),
    signIn: (l: Locale) => path(l, "/signin"),
} as const;

export const EXPEDITIONS_URL = "https://expedition.goodsurfing.org/";
export const INTERNATIONAL_URL = "https://international.goodsurfing.org/";
export const PUBLIC_OFFER_PDF = "/assets/docs/npo/Публичная_оферта.pdf";
