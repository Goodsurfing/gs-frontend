export type LanguagesCodes = "RU" | "UK" | "ES";
export type LanguagesNames = "Русский" | "English" | "Español";

export interface ILanguage {
    id: string;
    code: LanguagesCodes;
    name: LanguagesNames;
    icon: string;
}
