import { Locale, LocaleNames } from "@/entities/Locale";

type LanguageDropdownItemProps = {
    name: LocaleNames;
    value: Locale;
};

export const localeCountry = [{
}];

export const localeCity = [];

export const localeLanguage: Readonly<LanguageDropdownItemProps[]> = [{
    name: "Русский",
    value: "ru",
}, {
    name: "English",
    value: "en",
}, {
    name: "Español",
    value: "es",
}];
