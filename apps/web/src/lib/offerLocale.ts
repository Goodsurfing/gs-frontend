import type { Locale } from "@/i18n/config";

/** Параметр языка для GET /vacancy: на /en и /es бэкенд добавит переводы названий (GS-227) */
export const vacancyLang = (locale: Locale): { lang?: "en" | "es" } => (locale === "ru" ? {} : { lang: locale });

/** Карточка на языке страницы: перевод названия и краткого описания, если есть. Работает и на сервере, и в браузере */
export function localizeCard<T extends { title?: string | null; shortDescription?: string | null; translatedTitle?: string | null; translatedShortDescription?: string | null }>(card: T): T {
    if (!card.translatedTitle) return card;
    return { ...card, title: card.translatedTitle, shortDescription: card.translatedShortDescription ?? card.shortDescription };
}
