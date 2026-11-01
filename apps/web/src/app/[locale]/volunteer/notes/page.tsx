import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CabinetShell } from "@/components/cabinet/CabinetShell";
import { VolunteerNotes } from "@/components/cabinet/volunteer/VolunteerNotes";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { authMetadata } from "@/lib/authPages";
import { categoryLabels } from "@/lib/categories";
import { routes } from "@/lib/routes";
import { volunteerMenu } from "@/lib/volunteerMenu";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.volunteerNotes(locale), "main.sidebar.Заявки") : {};
}

/** Кабинет волонтёра: «Мои заявки» (VolunteerNotesPage старого фронта) */
export default async function VolunteerNotesPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const [t, tv, th] = await Promise.all([getTranslator(locale), getTranslator(locale, "volunteer"), getTranslator(locale, "host")]);
    return (
        <CabinetShell locale={locale} items={volunteerMenu(locale, t)} need="volunteer">
            <main className="w-full">
                <h2 className="text-[1.625rem] leading-8 font-normal">{tv("volunteer-notes.Мои заявки")}</h2>
                <VolunteerNotes
                    hrefs={{ offer: routes.offerTemplate(locale), chat: routes.messengerChatTemplate(locale) }}
                    categories={categoryLabels(t)}
                    labels={{
                        statuses: { new: t("notes.new"), accepted: t("notes.accepted"), canceled: t("notes.canceled") },
                        message: t("notes.Сообщение"),
                        review: t("notes.Написать отзыв"),
                        noTitle: "Без заголовка",
                        noAddress: "Без адреса",
                        sendError: th("host-dashboard.Ошибка"),
                        pagination: { prev: t("pagination.prev"), next: t("pagination.next"), page: t("pagination.label") },
                        dialog: {
                            // Заголовок и сообщение об успехе в старом фронте не переводились
                            title: "Оставьте отзыв",
                            rating: th("host-dashboard.Оставьте отзыв"),
                            text: th("host-dashboard.Напишите ваш отзыв"),
                            hint: th("host-dashboard.Поставьте оценку, чтобы оставить отзыв"),
                            send: th("host-dashboard.Оставить отзыв"),
                            sent: "Ваш отзыв был отправлен",
                            close: t("Закрыть"),
                        },
                    }}
                />
            </main>
        </CabinetShell>
    );
}
