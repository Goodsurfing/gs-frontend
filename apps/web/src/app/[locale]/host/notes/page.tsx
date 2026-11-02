import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CabinetShell } from "@/components/cabinet/CabinetShell";
import { HostNotes } from "@/components/cabinet/host/HostNotes";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { authMetadata } from "@/lib/authPages";
import { hostMenu } from "@/lib/cabinetMenus";
import { applicationLabels } from "@/lib/hostApplications";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.hostNotes(locale), "main.sidebar.Заявки") : {};
}

/** Кабинет организатора: заявки по колонкам (HostNotesPage старого фронта) */
export default async function HostNotesPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const [t, th, common] = await Promise.all([getTranslator(locale), getTranslator(locale, "host"), applicationLabels(locale)]);
    const n = (key: string) => th(`hostNotes.${key}`);
    return (
        <CabinetShell locale={locale} items={hostMenu(locale, t)} need="host" fitContent>
            <main>
                <h2 className="text-[1.625rem] leading-8 font-normal">{n("Мои заявки")}</h2>
                <HostNotes
                    routes={{ volunteer: routes.volunteerPublicTemplate(locale), offer: routes.offer(locale, "{id}"), chat: routes.messengerChat(locale, "{id}") }}
                    labels={{
                        vacancy: n("Вакансия"),
                        allVacancies: n("Все вакансии"),
                        untitled: n("Без названия"),
                        statusError: common.statusError,
                        reviewTitle: n("Оставьте отзыв"),
                        pages: { prev: t("pagination.prev"), next: t("pagination.next"), page: t("pagination.label") },
                        card: common.card,
                        dialog: { ...common.dialog, title: n("Оставьте отзыв"), sent: n("Ваш отзыв был отправлен") },
                    }}
                />
            </main>
        </CabinetShell>
    );
}
