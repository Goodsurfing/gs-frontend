import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CabinetShell } from "@/components/cabinet/CabinetShell";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { authMetadata } from "@/lib/authPages";
import { routes } from "@/lib/routes";
import { volunteerMenu } from "@/lib/volunteerMenu";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.volunteerSubscribers(locale), "main.sidebar.Подписки") : {};
}

/**
 * Кабинет волонтёра: «Подписки» (VolunteerSubscribersPage старого фронта).
 * Подписок в API пока нет — в старом фронте страница показывала только
 * заголовок (список всегда пустой), пункта меню у неё нет.
 */
export default async function VolunteerSubscribersPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const [t, tv] = await Promise.all([getTranslator(locale), getTranslator(locale, "volunteer")]);
    return (
        <CabinetShell locale={locale} items={volunteerMenu(locale, t)} need="volunteer">
            <main className="w-full">
                <h2 className="text-[1.5em] font-bold">{tv("volunteer-subscribers.Подписки")}</h2>
                <div className="mt-10" />
            </main>
        </CabinetShell>
    );
}
