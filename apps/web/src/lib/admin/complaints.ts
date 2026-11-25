import { routes } from "@/lib/routes";

/** Раздел «Жалобы» админки (GS-282): форма ответа /admin/v1/complaints (ComplaintAdmin::item в gs-backend) */

export type ComplaintTargetType = "message" | "user" | "organization" | "review_vacancy" | "review_volunteer";
export type ComplaintAction = "none" | "hide_review" | "disable_user";

export interface Complaint {
    id: number;
    createdAt: string;
    source: "user" | "auto";
    reason: string;
    comment: string | null;
    excerpt: string | null;
    matched: string | null;
    status: "new" | "resolved";
    resolution: "none" | "review_hidden" | "user_disabled" | null;
    resolvedAt: string | null;
    resolvedBy: string | null;
    targetType: ComplaintTargetType;
    targetId: string;
    reporter: { id: string; name: string; email: string } | null;
    targetUser: { id: string; name: string; email: string; isActive: boolean; organizationId: string | null } | null;
    chatId: number | null;
    vacancyId: number | null;
    volunteerId: string | null;
    reviewActive: boolean | null;
    /** Только в карточке: другие жалобы на того же человека */
    sameUserCount?: number;
}

export const REASON_TITLE: Record<string, string> = { spam: "Спам", abuse: "Оскорбления", fraud: "Мошенничество", other: "Другое" };

export const TARGET_TITLE: Record<ComplaintTargetType, string> = {
    message: "Сообщение",
    user: "Пользователь",
    organization: "Организация",
    review_vacancy: "Отзыв о вакансии",
    review_volunteer: "Отзыв о волонтёре",
};

export const STATUS_TITLE: Record<Complaint["status"], string> = { new: "Новая", resolved: "Разобрана" };

export const RESOLUTION_TITLE: Record<NonNullable<Complaint["resolution"]>, string> = {
    none: "Разобрано",
    review_hidden: "Отзыв скрыт",
    user_disabled: "Пользователь отключён",
};

export const isReview = (type: ComplaintTargetType) => type === "review_vacancy" || type === "review_volunteer";

/** Ссылки «на что жалоба»: публичная страница объекта и карточка нарушителя в админке */
export function complaintLinks(c: Pick<Complaint, "targetType" | "targetId" | "targetUser" | "vacancyId" | "volunteerId">): { label: string; href: string }[] {
    const links: { label: string; href: string }[] = [];
    switch (c.targetType) {
        case "user":
            links.push({ label: "Профиль на сайте", href: routes.volunteerPublic("ru", c.targetId) });
            break;
        case "organization":
            links.push({ label: "Организация на сайте", href: routes.organization("ru", c.targetId) });
            break;
        case "review_vacancy":
            if (c.vacancyId !== null) links.push({ label: "Вакансия с отзывом", href: `${routes.offer("ru", c.vacancyId)}#review` });
            break;
        case "review_volunteer":
            if (c.volunteerId) links.push({ label: "Волонтёр с отзывом", href: routes.volunteerPublic("ru", c.volunteerId) });
            break;
        case "message":
            break;
    }
    if (c.targetUser) links.push({ label: `Карточка: ${c.targetUser.name || c.targetUser.email}`, href: `/admin/users/${c.targetUser.id}` });
    return links;
}

/** Какие кнопки разбора показать: «Скрыть отзыв» — у видимого отзыва, «Отключить» — у активного пользователя */
export function complaintActions(c: Pick<Complaint, "status" | "targetType" | "reviewActive" | "targetUser">): ComplaintAction[] {
    if (c.status !== "new") return [];
    const actions: ComplaintAction[] = ["none"];
    if (isReview(c.targetType) && c.reviewActive) actions.push("hide_review");
    if (c.targetUser?.isActive) actions.push("disable_user");
    return actions;
}

export const ACTION_TITLE: Record<ComplaintAction, string> = {
    none: "Разобрано",
    hide_review: "Скрыть отзыв",
    disable_user: "Отключить пользователя",
};

export const ACTION_CONFIRM: Record<ComplaintAction, string> = {
    none: "Отметить жалобу разобранной без действий?",
    hide_review: "Скрыть отзыв с сайта? Другие жалобы на этот отзыв тоже будут разобраны",
    disable_user: "Отключить пользователя? Он не сможет войти, его вакансии скроются. Другие жалобы на него тоже будут разобраны",
};
