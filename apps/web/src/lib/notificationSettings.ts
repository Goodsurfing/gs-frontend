/** Настройки уведомлений (gs-backend NotificationSettings): типы и каналы — в порядке таблицы */
export const TYPES = ["new_application", "new_message", "unanswered_reminder", "news"] as const;
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
};

/** Сразу показать галочку, не дожидаясь ответа сервера */
export function toggleCell(state: NotificationState, type: NotificationType, channel: Channel, enabled: boolean): NotificationState {
    return { ...state, matrix: { ...state.matrix, [type]: { ...state.matrix[type], [channel]: enabled } } };
}
