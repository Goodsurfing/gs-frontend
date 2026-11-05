import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CabinetShell } from "@/components/cabinet/CabinetShell";
import { SavedSearches } from "@/components/cabinet/profile/SavedSearches";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { authMetadata } from "@/lib/authPages";
import { profileMenu } from "@/lib/cabinetMenus";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: string }> };

const KEYS = ["intro", "empty", "toMap", "name", "email", "weekly", "daily", "off", "push", "open", "delete", "deleteConfirm", "cancel", "saved", "error", "loadError", "retry"] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.profileSubscriptions(locale), "main.sidebar.Подписки на поиск") : {};
}

/** Кабинет: подписки на подборку вакансий (05.11.2026) */
export default async function ProfileSubscriptionsPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const [t, tp] = await Promise.all([getTranslator(locale), getTranslator(locale, "profile")]);
    // {{name}} заполняет компонент — переводчик заменил бы его пустой строкой
    const label = (key: string) => tp(`subscriptions.${key}`, { name: "{{name}}" });
    return (
        <CabinetShell locale={locale} items={profileMenu(locale, t)}>
            <main className="w-full">
                <h2 className="text-[1.625rem] font-normal">{label("title")}</h2>
                <SavedSearches mapHref={routes.offersMap(locale)} labels={Object.fromEntries(KEYS.map((key) => [key, label(key)])) as Record<(typeof KEYS)[number], string>} />
            </main>
        </CabinetShell>
    );
}
