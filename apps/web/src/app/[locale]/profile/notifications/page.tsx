import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CabinetShell } from "@/components/cabinet/CabinetShell";
import { NotificationSettings } from "@/components/cabinet/host/notifications/NotificationSettings";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { authMetadata } from "@/lib/authPages";
import { profileMenu } from "@/lib/cabinetMenus";
import { notificationLabels } from "@/lib/notificationLabels";
import { VOLUNTEER_TYPES } from "@/lib/notificationSettings";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.profileNotifications(locale), "main.sidebar.Уведомления") : {};
}

/** Профиль: уведомления волонтёра — ответ организатора, решение по заявке, новости; Telegram */
export default async function ProfileNotificationsPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const t = await getTranslator(locale);
    return (
        <CabinetShell locale={locale} items={profileMenu(locale, t)}>
            <main className="w-full">
                <h2 className="text-[1.625rem] font-normal">{t("notifications.title")}</h2>
                <NotificationSettings types={VOLUNTEER_TYPES} labels={notificationLabels(t, "introVolunteer")} />
            </main>
        </CabinetShell>
    );
}
