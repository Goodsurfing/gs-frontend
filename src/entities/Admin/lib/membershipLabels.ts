// Подписи и даты для ручного членства в админке (админка не переводится)

export const MEMBERSHIP_STATUS_LABEL: Record<string, string> = {
    PENDING: "Ждёт оплаты",
    ACTIVE: "Действует",
    EXPIRED: "Истекло",
    CANCELLED: "Снято",
    REFUNDED: "Возврат",
    RENEWED: "Продлено",
};

export const MEMBERSHIP_SOURCE_LABEL: Record<string, string> = {
    PURCHASE: "Оплата",
    ADMIN: "Выдано вручную",
    LEGACY_IMPORT: "Со старого сайта",
};

export const MEMBERSHIP_CATEGORY_LABEL: Record<string, string> = {
    REGULAR: "Обычное",
    INTERNATIONAL: "Международное",
};

export const MEMBERSHIP_ROLE_LABEL: Record<string, string> = {
    VOLUNTEER: "волонтёр",
    HOST: "организатор",
    BOTH: "волонтёр и организатор",
};

export const MEMBERSHIP_ACTION_LABEL: Record<string, string> = {
    GRANT: "Выдал",
    REVOKE: "Снял",
};

const MOSCOW = "Europe/Moscow";

/**
 * Дата из ISO-строки бэкенда (ATOM) — как её записал сервер, без перевода
 * в пояс: «до 31.01» хранится как 31.01 23:59:59 UTC, по Москве это уже 01.02
 */
export const formatAdminDate = (value: string | null) => {
    const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})/);
    return match ? `${match[3]}.${match[2]}.${match[1]}` : "—";
};

export const formatAdminDateTime = (value: string | null) => (
    value
        ? new Date(value).toLocaleString("ru-RU", {
            timeZone: MOSCOW, dateStyle: "short", timeStyle: "short",
        })
        : "—"
);

/** «До» в журнале: для выдачи — дата или «бессрочно», для снятия — прочерк */
export const formatLogEndDate = (entry: { action: string; endDate: string | null }) => {
    if (entry.action !== "GRANT") return "—";
    return entry.endDate ? formatAdminDate(entry.endDate) : "бессрочно";
};
