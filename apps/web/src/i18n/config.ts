export const LOCALES = ["ru", "en", "es"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "ru";

export const isLocale = (value: string): value is Locale => (LOCALES as readonly string[]).includes(value);

/**
 * Язык в адресе (решение владельца 29.10.2026): у русского префикса нет
 * (/payment-security-policy), у остальных есть (/en/…, /es/…). Старые /ru/…
 * отвечают 301 (src/proxy.ts). Правила те же, что у старого SPA
 * (src/shared/config/routes/localePath.ts в корне).
 */
const LOCALE_SEGMENT = /^\/(ru|en|es)(?=\/|$)/;

/** Префикс языка: "" у русского, "/en" и "/es" у остальных. */
export const localePrefix = (locale: Locale) => (locale === DEFAULT_LOCALE ? "" : `/${locale}`);

/** Язык по адресу: /en/…, /es/… — свои, всё остальное — русский. */
export const localeFromPath = (pathname: string): Locale => {
    const segment = pathname.split("/")[1] ?? "";
    return segment === "en" || segment === "es" ? segment : DEFAULT_LOCALE;
};

/** Адрес без языкового сегмента (включая устаревший /ru). */
export const stripLocale = (pathname: string) => pathname.replace(LOCALE_SEGMENT, "") || "/";

/** Та же страница на другом языке: /blog → /en/blog, /en/blog → /blog, главная en — /en. */
export const withLocale = (pathname: string, locale: Locale) => {
    const rest = stripLocale(pathname);
    const prefix = localePrefix(locale);
    if (!prefix) return rest;
    return rest === "/" ? prefix : `${prefix}${rest}`;
};
