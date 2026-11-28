/** Настройки уведомлений (gs-backend NotificationSettings): типы и каналы — в порядке таблицы */
export const HOST_TYPES = ["new_application", "new_message", "unanswered_reminder", "news"] as const;
export const VOLUNTEER_TYPES = ["host_reply", "application_status", "news"] as const;
/** Все виды — для подписей (страница организатора и профиль волонтёра) */
export const TYPES = ["new_application", "new_message", "unanswered_reminder", "host_reply", "application_status", "news"] as const;
export const CHANNELS = ["email", "telegram", "max", "push"] as const;
export type NotificationType = (typeof TYPES)[number];
export type Channel = (typeof CHANNELS)[number];

export type NotificationState = {
    /** null — канал для этого уведомления не предусмотрен */
    matrix: Record<string, Record<string, boolean | null>>;
    channels: {
        telegram: { available: boolean; connected: boolean; username?: string | null };
        max: { available: boolean; connected: boolean };
    };
    /** Кнопка «Прислать сводку сейчас» — только на тестовой версии (GS-298) */
    digestTest?: boolean;
};

/** Ответ «Прислать сводку сейчас»: count — сколько заявок без ответа (0 — ничего не отправлено) */
export type DigestTestResult = { count: number; email: boolean; channels: string[] };

export type DigestTestLabels = { title: string; hint: string; button: string; sending: string; none: string; sent: string; telegram: string; off: string; error: string };

/** Что сказать после «Прислать сводку сейчас» */
export function digestTestMessage(result: DigestTestResult, labels: DigestTestLabels): string {
    if (result.count === 0) return labels.none;
    if (!result.email && result.channels.length === 0) return labels.off;
    const where = [result.email ? labels.sent : null, result.channels.includes("telegram") ? labels.telegram : null].filter(Boolean).join(" ");
    return where.replace("{count}", String(result.count));
}

/** Сразу показать галочку, не дожидаясь ответа сервера */
export function toggleCell(state: NotificationState, type: NotificationType, channel: Channel, enabled: boolean): NotificationState {
    return { ...state, matrix: { ...state.matrix, [type]: { ...state.matrix[type], [channel]: enabled } } };
}
