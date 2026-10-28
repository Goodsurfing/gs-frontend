export const LOCALES = ["ru", "en", "es"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "ru";

export const isLocale = (value: string): value is Locale => (LOCALES as readonly string[]).includes(value);
