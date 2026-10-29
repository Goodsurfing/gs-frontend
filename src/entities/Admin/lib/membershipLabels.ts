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

/** Дата из ISO-строки бэкенда (ATOM), по Москве */
export const formatAdminDate = (value: string | null) => (
    value
        ? new Date(value).toLocaleDateString("ru-RU", { timeZone: MOSCOW })
        : "—"
);

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
