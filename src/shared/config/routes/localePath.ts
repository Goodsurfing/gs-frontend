import type { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";

/**
 * Язык в адресе (решение владельца 29.10.2026): у русского префикса нет
 * (/offers-map), у остальных есть (/en/offers-map, /es/offers-map). Старые
 * адреса /ru/… отвечают 301 на адрес без префикса (nginx) — ссылки в
 * письмах, закладках и у поисковиков продолжают работать.
 */
export const DEFAULT_LOCALE: Locale = "ru";
const PREFIXED_LOCALES = ["en", "es"] as const;
const LOCALE_SEGMENT = /^\/(ru|en|es)(?=\/|$)/i;

const isPrefixed = (value: string): value is (typeof PREFIXED_LOCALES)[number] => (
    (PREFIXED_LOCALES as readonly string[]).includes(value)
);

/** Префикс языка для адреса: "" у русского, "/en" и "/es" у остальных. */
export const localePrefix = (locale: string): string => (isPrefixed(locale) ? `/${locale}` : "");

/** Язык по адресу: первый сегмент en/es, иначе русский. */
export const localeFromPath = (pathname: string): Locale => {
    const segment = pathname.split("/")[1]?.toLowerCase() ?? "";
    return isPrefixed(segment) ? segment : DEFAULT_LOCALE;
};

/** Адрес без языкового сегмента (включая устаревший /ru): /en/blog → /blog. */
export const stripLocale = (pathname: string): string => pathname.replace(LOCALE_SEGMENT, "") || "/";

/** Тот же адрес на другом языке: /blog → /en/blog, /en/blog → /blog. */
export const withLocalePath = (pathname: string, locale: string): string => {
    const rest = stripLocale(pathname);
    const prefix = localePrefix(locale);
    if (!prefix) return rest;
    return rest === "/" ? `${prefix}/` : `${prefix}${rest}`;
};

/** Устаревший адрес с /ru в начале — его нужно перенаправить на адрес без префикса. */
export const isLegacyRuPath = (pathname: string): boolean => /^\/ru(?=\/|$)/i.test(pathname);
