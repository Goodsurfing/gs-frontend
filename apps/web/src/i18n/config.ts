export const LOCALES = ["ru", "en", "es"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "ru";

export const isLocale = (value: string): value is Locale => (LOCALES as readonly string[]).includes(value);

const LOCALE_PREFIX = new RegExp(`^/(${LOCALES.join("|")})(?=/|$)`);

/** Та же страница на другом языке: /ru/blog → /en/blog, адрес без языка — /en. */
export const withLocale = (pathname: string, locale: Locale) =>
    LOCALE_PREFIX.test(pathname) ? pathname.replace(LOCALE_PREFIX, `/${locale}`) : `/${locale}${pathname === "/" ? "" : pathname}`;
