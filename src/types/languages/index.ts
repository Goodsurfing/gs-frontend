export type LanguagesCodes = 'ru' | 'en' | 'es';
export type LanguagesNames = 'Русский' | 'English' | 'Español';

export interface ILanguage {
    id: string;
    code: LanguagesCodes;
    name: LanguagesNames;
    icon: string;
}
