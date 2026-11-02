import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RequireUser } from "@/components/cabinet/RequireUser";
import { PublicShell } from "@/components/layout/PublicShell";
import { FavoriteOffers } from "@/components/offers/FavoriteOffers";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { categoryLabels } from "@/lib/categories";
import { routes } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    const [tOffer, tMain] = await Promise.all([getTranslator(locale, "offer"), getTranslator(locale, "main")]);
    return pageMetadata({ locale, path: routes.favoriteOffers(locale), title: `${tOffer("Избранные вакансии")} — GoodSurfing`, description: tMain("seo.description"), noindex: true });
}

/**
 * Избранные вакансии (FavoriteOffersPage старого фронта): публичный каркас
 * с подвалом, но только для вошедших — гостя на вход.
 */
export default async function FavoriteOffersPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const [t, tOffer] = await Promise.all([getTranslator(locale), getTranslator(locale, "offer")]);
    return (
        <PublicShell locale={locale} topGap>
            <RequireUser locale={locale} />
            <div className="flex flex-col gap-5 p-5">
                <h1 className="text-[2em] font-bold">{tOffer("Избранные вакансии")}</h1>
                <FavoriteOffers
                    hrefs={{ offer: routes.offerTemplate(locale), offersMap: routes.offersMap(locale) }}
                    categories={categoryLabels(t)}
                    labels={{
                        empty: tOffer("Вы пока не добавили ни одну вакансию в избранное, давайте это исправим?"),
                        viewOffers: tOffer("Посмотреть вакансии"),
                        add: t("Добавить в избранное"),
                        remove: t("Убрать из избранного"),
                        card: {
                            more: t("Подробнее"),
                            notOnMap: t("нет на карте"),
                            reviews: t("Отзывов"),
                            went: t("Отправились"),
                            noTitle: t("Без заголовка"),
                            noDescription: t("Без описания"),
                        },
                    }}
                />
            </div>
        </PublicShell>
    );
}
