import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { OfferWizardShell, offerWizardMetadata } from "@/components/offer-wizard/OfferWizardShell";
import { WhereForm } from "@/components/offer-wizard/WhereForm";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { parseOfferId } from "@/lib/offerWizard";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, id } = await params;
    const offerId = parseOfferId(id);
    return isLocale(locale) && offerId ? offerWizardMetadata(locale, "where", offerId) : {};
}

/** Мастер вакансии, шаг «Где» (OfferWherePage старого фронта) */
export default async function OfferWherePage({ params }: Props) {
    const { locale, id } = await params;
    const offerId = parseOfferId(id);
    if (!isLocale(locale) || !offerId) notFound();
    const [t, tOffer, tMain] = await Promise.all([getTranslator(locale), getTranslator(locale, "offer"), getTranslator(locale, "main")]);
    return (
        <OfferWizardShell locale={locale} id={offerId}>
            <h1 className="text-[1.625rem] leading-[120%] font-normal text-ink-secondary down-lg:text-center">{tOffer("where.Где вы находитесь или будете принимать волонтеров")}</h1>
            <WhereForm
                id={offerId}
                locale={locale}
                nextHref={routes.offerStep(locale, "when", offerId)}
                labels={{
                    address: tOffer("where.Введите адрес"),
                    noOptions: tOffer("where.Точек на карте не найдено"),
                    required: tOffer("where.Укажите пожалуйста адрес"),
                    saved: tOffer("where.Адрес успешно изменён"),
                    error: tOffer("Произошла ошибка"),
                    save: tOffer("Сохранить"),
                    next: tOffer("Дальше"),
                    unsaved: tOffer("У вас есть несохраненные изменения"),
                    // Подсказки MUI старого фронта не переводились — английские во всех языках
                    clear: "Clear",
                    open: "Open",
                    close: "Close",
                    loading: t("Загрузка"),
                    missing: tMain("Вакансия не найдена или произошла ошибка"),
                }}
            />
        </OfferWizardShell>
    );
}
