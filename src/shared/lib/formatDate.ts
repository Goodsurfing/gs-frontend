import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";

export const formatDate = (locale: Locale, date: string) => {
    const localeList: Record<Locale, string> = {
        ru: "ru-RU",
        en: "en-US",
        es: "ru-RU",
    };

    const newDate = new Date(date);
    const formattedDate = newDate.toLocaleDateString(localeList[locale], {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
    return formattedDate;
};
