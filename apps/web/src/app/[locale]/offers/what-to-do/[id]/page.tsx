import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { OfferWizardShell, offerWizardMetadata } from "@/components/offer-wizard/OfferWizardShell";
import { StepIntro } from "@/components/offer-wizard/StepIntro";
import { WhatToDoForm } from "@/components/offer-wizard/WhatToDoForm";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { parseOfferId } from "@/lib/offerWizard";
import { routes } from "@/lib/routes";
import { firstChar } from "@/lib/textSlice";

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, id } = await params;
    const offerId = parseOfferId(id);
    return isLocale(locale) && offerId ? offerWizardMetadata(locale, "what-to-do", offerId) : {};
}

/** С заглавной: «в неделю» словаря → «В неделю», как в старом списке */
const capital = (text: string) => { const first = firstChar(text); return first.toUpperCase() + text.slice(first.length); };

/** Мастер вакансии, шаг «Что делать» (OfferWhatToDoPage старого фронта) */
export default async function OfferWhatToDoPage({ params }: Props) {
    const { locale, id } = await params;
    const offerId = parseOfferId(id);
    if (!isLocale(locale) || !offerId) notFound();
    const [t, tOffer, tMain, tVolunteer] = await Promise.all([getTranslator(locale), getTranslator(locale, "offer"), getTranslator(locale, "main"), getTranslator(locale, "volunteer")]);
    const w = (key: string) => tOffer(`whatToDo.${key}`);
    return (
        <OfferWizardShell locale={locale} id={offerId}>
            <div data-testid="offer-step">
                <StepIntro title={w("Расскажите, чем нужно будет заниматься")} text={w("Подробно опишите, чем нужно будет заниматься — чем больше информации, тем лучше.")} />
                <WhatToDoForm
                    id={offerId}
                    locale={locale}
                    nextHref={routes.offerStep(locale, "conditions", offerId)}
                    labels={{
                        skills: w("Навыки, которыми должен обладать волонтёр"),
                        addSkill: tVolunteer("volunteer-skills.Добавить навык"),
                        hours: w("Количество рабочих часов"),
                        timeTypes: { week: capital(w("week")), day: capital(w("day")), month: capital(w("month")) },
                        daysOff: w("Количество выходных дней в неделю"),
                        extraInfo: w("Дополнительная информация"),
                        maxChars: w("Не более 1000 знаков"),
                        deleteSkill: "✖",
                        // Сообщение старого фронта, ключа в словаре нет — во всех языках по-русски, как было
                        saved: tOffer("Данные успешно сохранены"),
                        error: tOffer("Произошла ошибка"),
                        save: w("Сохранить"),
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
