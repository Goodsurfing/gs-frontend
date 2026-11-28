/** Раздел «Пуши» админки: форма ответов /admin/v1/push-log и /admin/v1/push-log/summary (PushDeliveryJournal в gs-backend) */

export interface PushLogItem {
    id: number;
    /** МСК, d.m.Y H:i:s */
    createdAt: string;
    user: { id: string; name: string; email: string | null } | null;
    subscriptionId: number | null;
    channel: "web" | "expo";
    notificationType: string;
    provider: string;
    success: boolean;
    statusCode: number | null;
    error: string | null;
}

interface PushLogGroup {
    total: number;
    ok: number;
    errors: number;
}

export interface PushLogPeriod extends PushLogGroup {
    since: string;
    errorsByStatus: { statusCode: number | null; count: number }[];
    byProvider: (PushLogGroup & { provider: string })[];
    byType: (PushLogGroup & { notificationType: string })[];
}

export interface PushLogSummary {
    day: PushLogPeriod;
    week: PushLogPeriod;
}

export const PROVIDER_TITLE: Record<string, string> = {
    fcm: "Chrome / Android (FCM)",
    apple: "Safari / iPhone (Apple)",
    mozilla: "Firefox (Mozilla)",
    windows: "Edge (Windows)",
    expo: "Приложение (Expo)",
};

export const TYPE_TITLE: Record<string, string> = {
    message: "Сообщение",
    application: "Новая заявка",
    application_status: "Статус заявки",
    saved_search: "Подборка",
    achievement: "Значок",
    other: "Другое",
};

export const CHANNEL_TITLE: Record<PushLogItem["channel"], string> = { web: "Браузер", expo: "Приложение" };

export const providerTitle = (provider: string) => PROVIDER_TITLE[provider] ?? provider;
export const typeTitle = (type: string) => TYPE_TITLE[type] ?? type;

/** Что значит код ответа сервиса пушей — подсказка команде, куда смотреть */
export function statusMeaning(code: number | null): string {
    if (code === null) return "до сервиса пушей не дошло (сеть, шифрование)";
    if (code === 404 || code === 410) return "подписки больше нет — удалена";
    if (code === 403) return "ключи VAPID не подходят — проверить WEB_PUSH_* на сервере";
    if (code === 400) return "неверный запрос";
    if (code === 413) return "слишком большое уведомление";
    if (code === 429) return "сервис пушей просит реже";
    if (code >= 500) return "сбой сервиса пушей";
    return "";
}

/** Доля доставленных, целыми процентами; без отправок — null */
export function okPercent(group: PushLogGroup): number | null {
    return group.total > 0 ? Math.round((group.ok / group.total) * 100) : null;
}
