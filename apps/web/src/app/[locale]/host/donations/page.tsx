import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CabinetShell } from "@/components/cabinet/CabinetShell";
import { HostFundraises } from "@/components/cabinet/host/HostFundraises";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { authMetadata } from "@/lib/authPages";
import { hostMenu } from "@/lib/cabinetMenus";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.hostDonations(locale), "main.sidebar.Сборы") : {};
}

/** Кабинет организатора: «Мои сборы» (HostFundraisePage старого фронта; мастер сбора — в старом SPA) */
export default async function HostDonationsPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const [t, th, tv] = await Promise.all([getTranslator(locale), getTranslator(locale, "host"), getTranslator(locale, "volunteer")]);
    const f = (key: string) => th(`hostFundraises.${key}`);
    return (
        <CabinetShell locale={locale} items={hostMenu(locale, t)} need="host" fitContent>
            <main>
                <HostFundraises
                    locale={locale}
                    routes={{ fundraise: routes.fundraise(locale, "{id}"), welcome: routes.fundraiseWelcome(locale, "{id}") }}
                    labels={{
                        title: f("Мои сборы"),
                        drafts: f("Черновики"),
                        empty: f("Нет сборов"),
                        add: f("Добавить сбор"),
                        memberTitle: f("Возможность создавать сборы и получать финансовую поддержку для реализации своих проектов есть только у пользователей с оформленным членством Гудсёрфинга"),
                        memberButton: tv("volunteer-dashboard.Получить членство"),
                        edit: f("Редактировать"),
                        close: f("Закрыть"),
                        remove: f("Удалить"),
                        collected: f("Собрано"),
                        daysLeft: f("Осталось дней"),
                        confirm: f("Вы уверены что хотите изменить сбор?"),
                        ok: f("Ок"),
                        cancel: f("Отмена"),
                    }}
                />
            </main>
        </CabinetShell>
    );
}
