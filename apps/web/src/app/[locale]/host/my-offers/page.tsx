import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CabinetShell } from "@/components/cabinet/CabinetShell";
import { HostOffers } from "@/components/cabinet/host/HostOffers";
import { HostUpsellBanner } from "@/components/cabinet/host/HostUpsellBanner";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { authMetadata } from "@/lib/authPages";
import { hostMenu } from "@/lib/cabinetMenus";
import { categoryLabels } from "@/lib/categories";
import { hostUpsellLabels } from "@/lib/hostCabinet";
import { routes } from "@/lib/routes";
import { offerShareLabels } from "@/lib/shareLabels";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.myOffers(locale), "main.sidebar.Предложения") : {};
}

/** Кабинет организатора: «Мои вакансии» (HostOffersPage старого фронта; мастер вакансии — в старом SPA) */
export default async function HostMyOffersPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const [t, th, tv, upsell, tOffer] = await Promise.all([getTranslator(locale), getTranslator(locale, "host"), getTranslator(locale, "volunteer"), hostUpsellLabels(locale, "mediaSupport"), getTranslator(locale, "offer")]);
    const o = (key: string) => th(`hostOffers.${key}`);
    return (
        <CabinetShell locale={locale} items={hostMenu(locale, t)} need="host" fitContent>
            <main className="min-h-screen pb-9">
                <HostOffers
                    locale={locale}
                    routes={{ offer: routes.offer(locale, "{id}"), edit: routes.offerEdit(locale, "{id}"), welcome: routes.offerWelcome(locale, "{id}") }}
                    aside={<HostUpsellBanner locale={locale} vertical labels={upsell} />}
                    labels={{
                        title: o("Мои вакансии"),
                        drafts: o("Черновики"),
                        empty: o("Нет списка вакансий"),
                        add: o("Добавить предложение"),
                        edit: o("Редактировать"),
                        close: o("Закрыть"),
                        open: o("Открыть"),
                        remove: o("Удалить"),
                        reviews: o("Отзывов"),
                        went: o("Отправились"),
                        confirmToggle: o("Вы уверены что хотите изменить вакансию?"),
                        confirmDelete: o("confirmDelete"),
                        ok: o("Ок"),
                        cancel: o("Отмена"),
                        cantDelete: o("Вакансию удалить нельзя"),
                        createError: o("Ошибка создания вакансии"),
                        limitTitle: o("Бесплатно можно опубликовать только 1 вакансию. Оформите членство, чтобы публиковать без ограничений"),
                        limitButton: tv("volunteer-dashboard.Получить членство"),
                        closeWindow: t("Закрыть"),
                        pages: { prev: t("pagination.prev"), next: t("pagination.next"), page: t("pagination.label") },
                        categories: categoryLabels(t),
                        share: tOffer("share.button"),
                        shareDialog: offerShareLabels(tOffer),
                        sharePublished: tOffer("share.intro-published"),
                    }}
                />
            </main>
        </CabinetShell>
    );
}
