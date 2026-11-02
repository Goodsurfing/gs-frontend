import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CabinetShell } from "@/components/cabinet/CabinetShell";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { authMetadata } from "@/lib/authPages";
import { hostMenu } from "@/lib/cabinetMenus";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.hostTeam(locale), "main.sidebar.Команда") : {};
}

/**
 * Кабинет организатора: команда (HostTeamPage старого фронта). Добавление
 * участников в старом фронте выключено — только пояснение и «станет доступна позже».
 */
export default async function HostTeamPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const [t, th] = await Promise.all([getTranslator(locale), getTranslator(locale, "host")]);
    return (
        <CabinetShell locale={locale} items={hostMenu(locale, t)} need="host" fitContent>
            <main className="max-w-[820px]">
                <h2 className="text-[1.625rem] leading-8 font-normal text-ink-secondary">{th("hostTeam.Команда организации")}</h2>
                <p className="my-10 text-[14px] leading-[18.2px] font-medium">
                    {th("hostTeam.Владельцы команд могут добавлять участников в команду своей организации, добавляя их адреса электронной почты. У них должна быть учетная запись на сайте.")}
                </p>
                <h3 className="text-[1.17em] font-bold">{th("Функция станет доступна позже")}</h3>
            </main>
        </CabinetShell>
    );
}
