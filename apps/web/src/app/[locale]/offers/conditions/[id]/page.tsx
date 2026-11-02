import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ConditionsForm } from "@/components/offer-wizard/ConditionsForm";
import { OfferWizardShell, offerWizardMetadata } from "@/components/offer-wizard/OfferWizardShell";
import { StepIntro } from "@/components/offer-wizard/StepIntro";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { parseOfferId } from "@/lib/offerWizard";
import { EXTRA_FEATURES, GOODS } from "@/lib/offerText";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, id } = await params;
    const offerId = parseOfferId(id);
    return isLocale(locale) && offerId ? offerWizardMetadata(locale, "conditions", offerId) : {};
}

/** Мастер вакансии, шаг «Условия» (OfferConditionsPage старого фронта) */
export default async function OfferConditionsPage({ params }: Props) {
    const { locale, id } = await params;
    const offerId = parseOfferId(id);
    if (!isLocale(locale) || !offerId) notFound();
    const [t, tOffer, tMain] = await Promise.all([getTranslator(locale), getTranslator(locale, "offer"), getTranslator(locale, "main")]);
    const c = (key: string) => tOffer(`conditions.${key}`);
    return (
        <OfferWizardShell locale={locale} id={offerId}>
            <div data-testid="offer-step">
                <StepIntro title={c("Чем вы готовы обеспечить волонтёра")} text={c("Волонтёр помогает вам и будет делать это лучше, если ему будет комфортно. Создавая лучшие условия вы привлекаете лучших волонтёров.")} />
                <ConditionsForm
                    id={offerId}
                    locale={locale}
                    nextHref={routes.offerStep(locale, "finishing-touches", offerId)}
                    labels={{
                        housing: c("Жилье"),
                        food: c("Питание"),
                        travel: c("Оплачиваемый проезд"),
                        no: c("Нет"),
                        yes: c("Да"),
                        // NOT_SELECTED старого фронта — без перевода
                        notSelected: "Вы не выбрали ни одного пункта",
                        facilities: c("Удобства"),
                        extraFeatures: c("Дополнительные возможности"),
                        goods: GOODS.map((item) => ({ id: item.id, icon: item.icon, text: c(item.text) })),
                        features: EXTRA_FEATURES.map((item) => ({ id: item.id, icon: item.icon, text: c(item.text) })),
                        payment: c("Оплата"),
                        contribution: c("Взносы волонтера"),
                        reward: c("Вознаграждение труда"),
                        currency: c("Оплата"),
                        extraConditions: c("Дополнительные условия"),
                        maxChars: c("Не более 1000 знаков"),
                        saved: tOffer("Данные успешно сохранены"),
                        error: tOffer("Произошла ошибка"),
                        save: tOffer("Сохранить"),
                        next: tOffer("Дальше"),
                        unsaved: tOffer("У вас есть несохраненные изменения"),
                        loading: t("Загрузка"),
                        missing: tMain("Вакансия не найдена или произошла ошибка"),
                    }}
                />
            </div>
        </OfferWizardShell>
    );
}
