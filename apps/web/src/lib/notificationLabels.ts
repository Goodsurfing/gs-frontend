import type { NotificationSettingsLabels } from "@/components/cabinet/host/notifications/NotificationSettings";
import type { Translate } from "@/i18n/dictionary";
import { CHANNELS, type DigestTestLabels, TYPES } from "@/lib/notificationSettings";

const KEYS = ["intro", "connectTitle", "telegram", "max", "connect", "connecting", "connectHint", "connected", "disconnect", "soon", "unavailable", "tableTitle", "needConnect", "service", "quiet", "saveError", "loadError", "retry"] as const;

/** Подписи раздела «Уведомления» (общие для организатора и волонтёра; вступление — своё) */
export function notificationLabels(t: Translate, intro = "intro"): NotificationSettingsLabels {
    const n = (key: string) => t(`notifications.${key}`);
    return {
        ...(Object.fromEntries(KEYS.map((key) => [key, n(key === "intro" ? intro : key)])) as Record<(typeof KEYS)[number], string>),
        channels: Object.fromEntries(CHANNELS.map((c) => [c, n(`channels.${c}`)])) as NotificationSettingsLabels["channels"],
        types: Object.fromEntries(TYPES.map((type) => [type, n(`types.${type}`)])) as NotificationSettingsLabels["types"],
        hints: Object.fromEntries(TYPES.map((type) => [type, n(`hints.${type}`)])) as NotificationSettingsLabels["hints"],
    };
}

const DIGEST_KEYS = ["title", "hint", "button", "sending", "none", "sent", "telegram", "off", "error"] as const;

/** «Прислать сводку сейчас» в «Уведомлениях» организатора — только на тестовой версии (GS-298) */
export function digestTestLabels(t: Translate): DigestTestLabels {
    return Object.fromEntries(DIGEST_KEYS.map((key) => [key, t(`notifications.digestTest.${key}`)])) as DigestTestLabels;
}
