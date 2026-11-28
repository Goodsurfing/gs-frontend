import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CabinetShell } from "@/components/cabinet/CabinetShell";
import { VolunteerNotes } from "@/components/cabinet/volunteer/VolunteerNotes";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { reviewAssistantLabels } from "@/lib/reviewAssistantLabels";
import { authMetadata } from "@/lib/authPages";
import { routes } from "@/lib/routes";
import { offerShareLabels } from "@/lib/shareLabels";
import { volunteerMenu } from "@/lib/volunteerMenu";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.volunteerNotes(locale), "main.sidebar.Заявки") : {};
}

/** Кабинет волонтёра: «Мои заявки» — поиск, вкладки с числами, карточки со статусом и «что дальше» (GS-332) */
export default async function VolunteerNotesPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const [t, tv, th, tOffer] = await Promise.all([getTranslator(locale), getTranslator(locale, "volunteer"), getTranslator(locale, "host"), getTranslator(locale, "offer")]);
    const n = (key: string) => tv(`volunteer-notes.${key}`);
    const d = (key: string) => tv(`volunteer-dashboard.${key}`);
    return (
        <CabinetShell locale={locale} items={volunteerMenu(locale, t)} need="volunteer">
            <main className="w-full">
                <h2 className="text-[1.625rem] leading-8 font-normal">{tv("volunteer-notes.Мои заявки")}</h2>
                <VolunteerNotes
                    locale={locale}
                    hrefs={{ offer: routes.offerTemplate(locale), chat: routes.messengerChatTemplate(locale), catalog: routes.offersMap(locale) }}
                    labels={{
                        search: n("search"),
                        searchPlaceholder: n("searchPlaceholder"),
                        clearSearch: n("clearSearch"),
                        tabsLabel: n("tabsLabel"),
                        tabs: { all: n("tab.all"), new: n("tab.new"), accepted: n("tab.accepted"), canceled: n("tab.canceled") },
                        // Статус и «что дальше» — те же, что в «Моих откликах» на телефонном рабочем столе
                        card: {
                            status: { new: d("mobile.status.new"), accepted: d("mobile.status.accepted"), canceled: d("mobile.status.canceled") },
                            next: { new: d("mobile.next.new"), accepted: d("mobile.next.accepted"), canceled: d("mobile.next.canceled") },
                            noTitle: d("mobile.noTitle"),
                        },
                        openOffer: n("openOffer"),
                        review: t("notes.Написать отзыв"),
                        share: tOffer("share.button"),
                        loadError: n("loadError"),
                        retry: n("retry"),
                        empty: n("empty"),
                        emptyHint: n("emptyHint"),
                        find: n("find"),
                        emptySearch: n("emptySearch"),
                        emptyTab: n("emptyTab"),
                        resetSearch: n("resetSearch"),
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
                            assistant: reviewAssistantLabels(tv),
                        },
                        shareDialog: offerShareLabels(tOffer, "intro-volunteer"),
                    }}
                />
            </main>
        </CabinetShell>
    );
}
