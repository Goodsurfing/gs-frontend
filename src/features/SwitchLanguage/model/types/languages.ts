export type LanguagesCodes = "ru" | "en" | "es";
export type LanguagesNames = "Русский" | "English" | "Español";

export interface LanguageType {
    id: string;
    code: LanguagesCodes;
    name: LanguagesNames;
    icon: string;
}

export interface ChangeLocaleBody {
    locale: LanguagesCodes;
}
