import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";

export const formatDate = (locale: Locale, date: string) => {
    const localeList: Record<Locale, string> = {
        ru: "ru-RU",
        en: "en-US",
        es: "es-ES",
    };

    const newDate = new Date(date);
    const formattedDate = newDate.toLocaleDateString(localeList[locale], {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    return formattedDate.replace(/[-/]/g, ".");
};

export const formatMessageDate = (locale: Locale, isoDate: string) => {
    const localeList: Record<Locale, string> = {
        ru: "ru-RU",
        en: "en-US",
        es: "es-ES",
    };
    const date = new Date(isoDate);
    const now = new Date();

    const isToday = date.getFullYear() === now.getFullYear()
        && date.getMonth() === now.getMonth()
        && date.getDate() === now.getDate();

    const currentLocale = localeList[locale] || "en-US";

    if (isToday) {
        return date.toLocaleTimeString(currentLocale, { hour: "2-digit", minute: "2-digit" });
    }

    const formattedDate = date.toLocaleDateString(currentLocale, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    return formattedDate.replace(/[-/]/g, ".");
};
