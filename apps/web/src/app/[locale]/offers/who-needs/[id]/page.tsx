import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { OfferWizardShell, offerWizardMetadata } from "@/components/offer-wizard/OfferWizardShell";
import { WhoNeedsForm } from "@/components/offer-wizard/WhoNeedsForm";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { languageLabels, parseOfferId } from "@/lib/offerWizard";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, id } = await params;
    const offerId = parseOfferId(id);
    return isLocale(locale) && offerId ? offerWizardMetadata(locale, "who-needs", offerId) : {};
}

/** Мастер вакансии, шаг «Кто нужен» (OfferWhoNeedsPage старого фронта) */
export default async function OfferWhoNeedsPage({ params }: Props) {
    const { locale, id } = await params;
    const offerId = parseOfferId(id);
    if (!isLocale(locale) || !offerId) notFound();
    const [t, tOffer, tMain] = await Promise.all([getTranslator(locale), getTranslator(locale, "offer"), getTranslator(locale, "main")]);
    const w = (key: string) => tOffer(`whoNeeds.${key}`);
    return (
        <OfferWizardShell locale={locale} id={offerId}>
            <div className="min-h-screen">
                <h1 className="text-[1.625rem] leading-[120%] font-normal text-ink-secondary down-lg:text-center">{w("Кого бы вы хотели видеть у себя в волонтерах")}</h1>
                <p className="mt-10 text-[14px] font-normal text-ink down-lg:text-center">{w("Опишите, что должен уметь волонтер, что он должен делать и на каких языках вы с ним можете общаться.")}</p>
                <WhoNeedsForm
                    id={offerId}
                    nextHref={routes.offerStep(locale, "description", offerId)}
                    labels={{
                        genders: { female: w("Женщина"), male: w("Мужчина"), other: w("Другой") },
                        age: w("Возраст"),
                        from: tOffer("от"),
                        to: tOffer("до"),
                        andOlder: w("и старше"),
                        noAgeLimit: w("Без ограничения по возрасту"),
                        language: w("Знание языков"),
                        level: w("Уровень владения"),
                        ...languageLabels(tOffer),
                        oneLanguage: w("Обязателен один из этих языков"),
                        allLanguages: w("Все перечисленные языки обязательны"),
                        addLanguage: w("Добавить язык"),
                        removeLanguage: "✖",
                        places: w("Сколько волонтерских мест одновременно"),
                        receptionTitle: w("Откуда принимаю волонтеров"),
                        reception: { any: w("Не важно"), foreigners: w("Только иностранцев"), compatriot: w("Только из моей страны") },
                        additionalInfo: w("Дополнительная информация"),
                        additionalHint: w("Не более 1000 знаков"),
                        // THIS_FIELD_IS_REQUIRED старого фронта — без перевода, как было
                        required: "Это поле является обязательным",
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
