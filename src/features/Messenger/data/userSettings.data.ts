export type ValueSettings = "search_history" | "disable_notification" | "archive" | "clear_history" | "block_user" | "report";

export interface UserSettingsType {
    text: string;
    activeText?: string;
    value: ValueSettings;
}

export const userSettingsData: UserSettingsType[] = [
    {
        text: "Поиск по истории сообщений",
        value: "search_history",
    },
    {
        text: "Отключить уведомления",
        value: "disable_notification",
        activeText: "Включить уведомления",
    },
    {
        text: "Архивировать",
        value: "archive",
    },
    {
        text: "Очистить историю сообщений",
        value: "clear_history",
    },
    {
        text: "Заблокировать пользователя",
        value: "block_user",
    },
    {
        text: "Пожаловаться",
        value: "report",
    },
];
