export type LanguagesCodes = "ru" | "en" | "es";
export type LanguagesNames = "Русский" | "English" | "Español";

export interface ILanguage {
    id: string;
    code: LanguagesCodes;
    name: LanguagesNames;
    icon: string;
}

export type LevelLanguage = "not_matter" | "beginner" | "elementary" | "lower_intermediate" | "upper_intermediate" | "advanced" | "proficiency";

export interface Language {
    language: string;
    languageLevel: LevelLanguage
}
