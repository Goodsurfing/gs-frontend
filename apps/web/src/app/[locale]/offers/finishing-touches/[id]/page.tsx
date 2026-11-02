import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FinishTouchesForm } from "@/components/offer-wizard/FinishTouchesForm";
import { OfferWizardShell, offerWizardMetadata } from "@/components/offer-wizard/OfferWizardShell";
import { StepIntro } from "@/components/offer-wizard/StepIntro";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { parseOfferId } from "@/lib/offerWizard";
import { EXTRA_CONDITIONS } from "@/lib/offerText";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, id } = await params;
    const offerId = parseOfferId(id);
    return isLocale(locale) && offerId ? offerWizardMetadata(locale, "finishing-touches", offerId) : {};
}

/** Мастер вакансии, шаг «Последние штрихи» с публикацией (OfferFinishingTouchesPage старого фронта) */
export default async function OfferFinishingTouchesPage({ params }: Props) {
    const { locale, id } = await params;
    const offerId = parseOfferId(id);
    if (!isLocale(locale) || !offerId) notFound();
    const [t, tOffer, tMain, tHost, tVolunteer] = await Promise.all([
        getTranslator(locale), getTranslator(locale, "offer"), getTranslator(locale, "main"), getTranslator(locale, "host"), getTranslator(locale, "volunteer"),
    ]);
    const f = (key: string) => tOffer(`finishingTouches.${key}`);
    return (
        <OfferWizardShell locale={locale} id={offerId}>
            <div data-testid="offer-step">
                <StepIntro title={f("Требования к участнику")} />
                <FinishTouchesForm
                    id={offerId}
                    locale={locale}
                    myOffersHref={routes.myOffers(locale)}
                    labels={{
                        extraConditions: f("Дополнительные условия"),
                        conditions: EXTRA_CONDITIONS.map((item) => ({ id: item.id, icon: item.icon, text: f(item.text) })),
                        onlyVerified: f("Принимать заявки только от проверенных участников"),
                        helloTitle: f("Приветственное сообщение"),
                        helloLabel: f("Данное сообщение будет автоматически отправляться всем соискателям после того, как они нажмут кнопку «Участвовать»."),
                        rulesTitle: f("Согласие с правилами"),
                        rulesLabel: f("Добавьте информацию о правилах и условиях, существующих в вашем предложении, с которым соискатель должен быть ознакомлен в момент, когда он подаёт заявку."),
                        maxChars: f("Не более 1000 знаков"),
                        questionsTitle: f("Добавить вопросы"),
                        questionnaireLabel: f("Вы можете добавить стандартные вопросы волонтёру или ссылку на анкету, которую он должен заполнить и отправить. Данное сообщение будет автоматически отправляться всем соискателям после того, как они нажмут кнопку «Участвовать»."),
                        questionnaireHint: f("Добавить ссылку на анкету"),
                        // Сообщение старой формы — без перевода
                        badUrl: "Введите корректную ссылку",
                        question: tOffer("Добавить вопрос"),
                        removeQuestion: "✖",
                        addQuestion: tOffer("Добавить вопрос"),
                        publish: f("Опубликовать"),
                        saveChanges: f("Сохранить изменения"),
                        saveDraft: f("Сохранить в черновики"),
                        confirmPublish: tOffer("Вы уверены, что хотите опубликовать это предложение? После публикации его увидят другие пользователи"),
                        cancel: tOffer("Отмена"),
                        limitTitle: tHost("hostOffers.Бесплатно можно опубликовать только 1 вакансию. Оформите членство, чтобы публиковать без ограничений"),
                        limitButton: tVolunteer("volunteer-dashboard.Получить членство"),
                        close: "Close",
                        errors: {
                            "errors.freeAccountPublishedVacancyLimit": t("errors.freeAccountPublishedVacancyLimit"),
                            "errors.vacancyIncomplete": t("errors.vacancyIncomplete"),
                        },
                        error: tOffer("Произошла ошибка"),
                        unsaved: tOffer("У вас есть несохраненные изменения"),
                        loading: t("Загрузка"),
                        missing: tMain("Вакансия не найдена или произошла ошибка"),
                    }}
                />
            </div>
        </OfferWizardShell>
    );
}
