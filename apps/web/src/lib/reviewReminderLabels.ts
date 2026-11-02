import type { ReviewRemindersLabels } from "@/components/cabinet/ReviewReminders";

type T = (key: string) => string;

/** Подписи плашки «Оцените» (ключи reviewReminder.* в translation.json) */
export function reviewReminderLabels(t: T, side: "volunteer" | "host"): ReviewRemindersLabels {
    const r = (key: string) => t(`reviewReminder.${key}`);
    return side === "volunteer"
        ? {
            title: r("Оцените ваши проекты"),
            text: r("Как прошли ваши проекты? Ваша оценка поможет следующим волонтёрам"),
            rate: r("Оценить"),
            hide: r("Скрыть"),
            fallback: r("Без названия"),
            departure: r("Отъезд"),
        }
        : {
            title: r("Оцените волонтёров"),
            text: r("Оцените волонтёров, которые у вас побывали"),
            rate: r("Оценить"),
            hide: r("Скрыть"),
            fallback: r("Волонтёр"),
            departure: r("Отъезд"),
        };
}
