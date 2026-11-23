import type { Locale } from "@/i18n/config";

/** Событие ленты на главной (GS-241) — поля как в FeedEvent API, без зависимости от серверного кода */
export interface FeedEventView {
    type: string;
    at: string;
    title: string;
    targetKind: string;
    targetId: string;
    image?: string | null;
    personName?: string | null;
    personPlace?: string | null;
    personAvatar?: string | null;
    rating?: number | null;
    holders?: number | null;
    membership?: string | null;
}

export interface EventFeedLabels {
    badge: string;
    trip: string;
    member: string;
    memberInternational: string;
    vacancy: string;
    review: string;
    article: string;
    holders: string;
}

/** Меньше стольких событий — блока нет: пустоватая лента хуже никакой */
export const MIN_EVENTS = 3;

/** Что произошло — строка под картинкой; глаголы без рода («Получен значок», «Едет в проект») */
export function eventAction(event: FeedEventView, labels: EventFeedLabels): string {
    switch (event.type) {
        case "badge": return labels.badge;
        case "trip": return labels.trip;
        case "member": return event.membership === "international" ? labels.memberInternational : labels.member;
        case "vacancy": return labels.vacancy;
        case "review": return labels.review;
        default: return labels.article;
    }
}

const LOCALES: Record<Locale, string> = { ru: "ru-RU", en: "en-US", es: "es-ES" };

/** «сегодня», «вчера», «3 дня назад», «2 недели назад» — на языке страницы */
export function relativeTime(locale: Locale, iso: string, now = new Date()): string {
    const format = new Intl.RelativeTimeFormat(LOCALES[locale], { numeric: "auto" });
    const day = (date: Date) => Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
    const days = Math.round((day(now) - day(new Date(iso))) / 86_400_000);
    if (days < 7) return format.format(-Math.max(0, days), "day");
    return format.format(-Math.round(days / 7), "week");
}

/** «Получили: 12» — подставляет число в подпись (без склонений: «12 человек/человека» не нужно) */
export const holdersText = (template: string, count: number): string => template.replace("{count}", count.toLocaleString("ru-RU"));
