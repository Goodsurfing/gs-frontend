import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";

export const formatDate = (locale: Locale, date?: string) => {
    if (!date) return "";

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

export const formatMessageDate = (locale: Locale, isoDate?: string) => {
    if (!isoDate) return "Без даты";

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

export const formattingDate = (date?: Date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export const parseDate = (dateString: string | null | undefined) => {
    if (!dateString) {
        return undefined;
    }

    const parts = dateString.split(".").map(Number);
    if (parts.length !== 3) {
        return undefined;
    }

    const [day, month, year] = parts;

    if (
        !Number.isInteger(day)
    || !Number.isInteger(month)
    || !Number.isInteger(year)
    || day < 1 || day > 31
    || month < 1 || month > 12
    || year < 1900 || year > new Date().getFullYear() + 1
    ) {
        return undefined;
    }

    return {
        day,
        mounth: month,
        year,
    };
};
