import type { components } from "@goodsurfing/api";

/** Заявка волонтёра из GET /api/v1/application/list-of-volunteer */
export type VolunteerApplication = components["schemas"]["ListOfVolunteerResult"];

/** Статус заявки так, как его видит волонтёр: «На рассмотрении», «Принята», «Отклонена» */
export type ApplicationStatus = "new" | "accepted" | "canceled";

/** Неизвестный статус (бэкенд может пополнить список) показываем как «На рассмотрении» — не врём, что отказали */
export const applicationStatus = (status: string): ApplicationStatus =>
    status === "accepted" || status === "canceled" ? status : "new";

/**
 * Плашка статуса на телефоне — те же мягкие цвета, что StatusPill приложения gs-mobile:
 * ждём — синяя, принята — зелёная, отклонена — розовая.
 */
export const STATUS_TONE: Record<ApplicationStatus, string> = {
    new: "bg-m-primary-soft text-m-primary-dark",
    accepted: "bg-m-cta-soft text-m-cta-text",
    canceled: "bg-m-error-soft text-m-error-text",
};

/**
 * Порядок на телефоне (как «Мои заявки» в приложении): сначала живые заявки —
 * принятые и ждущие ответа, отклонённые ниже; внутри — свежие (больший id) выше.
 */
export function sortApplications(items: readonly VolunteerApplication[]): VolunteerApplication[] {
    const rank = (item: VolunteerApplication) => (applicationStatus(item.status) === "canceled" ? 1 : 0);
    return [...items].sort((a, b) => rank(a) - rank(b) || b.id - a.id);
}

/** Куда ведёт карточка заявки: в переписку, а если её нет — на вакансию */
export const applicationHref = (item: VolunteerApplication, hrefs: { chat: string; offer: string }): string =>
    item.chatId ? hrefs.chat.replace("{id}", String(item.chatId)) : hrefs.offer.replace("{id}", String(item.vacancy.id));

/** Даты заявки строкой «01.12.2026 — 15.12.2026» как пришли с API (d.m.Y), без разбора в Date */
export const applicationDates = (item: Pick<VolunteerApplication, "startDate" | "endDate">): string =>
    [item.startDate?.trim(), item.endDate?.trim()].filter(Boolean).join(" — ");

/** Подстановка {{имя}} в подпись, переданную с сервера */
export const fillTemplate = (template: string, values: Record<string, string | number>): string =>
    template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, name: string) => String(values[name] ?? ""));
