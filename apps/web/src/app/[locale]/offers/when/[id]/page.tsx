import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { OfferWizardShell, offerWizardMetadata } from "@/components/offer-wizard/OfferWizardShell";
import { WhenForm } from "@/components/offer-wizard/WhenForm";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { DURATION_MARKS, parseOfferId } from "@/lib/offerWizard";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, id } = await params;
    const offerId = parseOfferId(id);
    return isLocale(locale) && offerId ? offerWizardMetadata(locale, "when", offerId) : {};
}

/** Мастер вакансии, шаг «Когда» (OfferWhenPage старого фронта) */
export default async function OfferWhenPage({ params }: Props) {
    const { locale, id } = await params;
    const offerId = parseOfferId(id);
    if (!isLocale(locale) || !offerId) notFound();
    const [t, tOffer, tMain] = await Promise.all([getTranslator(locale), getTranslator(locale, "offer"), getTranslator(locale, "main")]);
    const w = (key: string) => tOffer(`when.${key}`);
    return (
        <OfferWizardShell locale={locale} id={offerId}>
            {/* Высота не меньше экрана, как .wrapper старой страницы: календарь последнего поля не обрезается */}
            <div className="min-h-screen">
            <h1 className="text-[26px] leading-8 font-normal text-black down-lg:text-center">{w("Укажите на какой срок или сроки вам нужен волонтер")}</h1>
            <WhenForm
                id={offerId}
                locale={locale}
                nextHref={routes.offerStep(locale, "who-needs", offerId)}
                labels={{
                    addPeriod: w("Добавить период"),
                    fullYear: w("Принимаю круглый год"),
                    lastMoment: w("Принимаю в последний момент"),
                    duration: w("Срок участия (от-до)"),
                    from: tOffer("от"),
                    to: tOffer("до"),
                    endDate: w("Дата окончания приема заявок"),
                    noEndDate: w("Нет даты окончания"),
                    // У полей дат старого фронта подписей не было — для чтения с экрана «от» и «до»
                    periodStart: tOffer("от"),
                    periodEnd: tOffer("до"),
                    removePeriod: "✖",
                    notSet: t("Не задано"),
                    words: { day: w("день"), days2: w("дня"), days5: w("дней"), month: w("месяц"), months2: w("месяца"), months5: w("месяцев") },
                    marks: DURATION_MARKS.map((mark) => ({ value: mark.value, label: tOffer(mark.key) })),
                    // Сообщение старого фронта, ключа в словаре нет — во всех языках по-русски, как было
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
