export type Locale = "ru" | "en" | "es";
export type LocaleNames = "Русский" | "English" | "Español";

export interface Language {
    id: string;
    code: Locale;
    name: LocaleNames;
    icon: string;
}
