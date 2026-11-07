import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CabinetShell } from "@/components/cabinet/CabinetShell";
import { NotificationSettings, type NotificationSettingsLabels } from "@/components/cabinet/host/notifications/NotificationSettings";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { authMetadata } from "@/lib/authPages";
import { hostMenu } from "@/lib/cabinetMenus";
import { CHANNELS, TYPES } from "@/lib/notificationSettings";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: string }> };

const KEYS = ["intro", "connectTitle", "telegram", "max", "connect", "connecting", "connectHint", "connected", "disconnect", "soon", "unavailable", "tableTitle", "needConnect", "service", "quiet", "saveError", "loadError", "retry"] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.hostNotifications(locale), "main.sidebar.Уведомления") : {};
}

/** Кабинет организатора: уведомления — Telegram (MAX скоро) и таблица «что и куда» */
export default async function HostNotificationsPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const t = await getTranslator(locale);
    const n = (key: string) => t(`notifications.${key}`);
    const labels: NotificationSettingsLabels = {
        ...(Object.fromEntries(KEYS.map((key) => [key, n(key)])) as Record<(typeof KEYS)[number], string>),
        channels: Object.fromEntries(CHANNELS.map((c) => [c, n(`channels.${c}`)])) as NotificationSettingsLabels["channels"],
        types: Object.fromEntries(TYPES.map((type) => [type, n(`types.${type}`)])) as NotificationSettingsLabels["types"],
        hints: Object.fromEntries(TYPES.map((type) => [type, n(`hints.${type}`)])) as NotificationSettingsLabels["hints"],
    };
    return (
        <CabinetShell locale={locale} items={hostMenu(locale, t)} need="host" fitContent>
            <main className="w-full">
                <h2 className="text-[1.625rem] font-normal">{n("title")}</h2>
                <NotificationSettings labels={labels} />
            </main>
        </CabinetShell>
    );
}
