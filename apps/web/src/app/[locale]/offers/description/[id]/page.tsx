import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DescriptionForm } from "@/components/offer-wizard/DescriptionForm";
import { OfferWizardShell, offerWizardMetadata } from "@/components/offer-wizard/OfferWizardShell";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { getFilterCategories } from "@/lib/offersFilterOptions";
import { parseOfferId } from "@/lib/offerWizard";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, id } = await params;
    const offerId = parseOfferId(id);
    return isLocale(locale) && offerId ? offerWizardMetadata(locale, "description", offerId) : {};
}

const ERROR_KEYS = [
    "description.Неверный формат файла",
    "description.Размер файла превышает 5МБ",
    "description.Неверный размер изображения. Минимум 1280x720",
];

/** Мастер вакансии, шаг «Описание» (OfferDescriptionPage старого фронта) */
export default async function OfferDescriptionPage({ params }: Props) {
    const { locale, id } = await params;
    const offerId = parseOfferId(id);
    if (!isLocale(locale) || !offerId) notFound();
    const [t, tOffer, tMain, tVolunteer, categories] = await Promise.all([
        getTranslator(locale), getTranslator(locale, "offer"), getTranslator(locale, "main"), getTranslator(locale, "volunteer"), getFilterCategories(locale),
    ]);
    const d = (key: string) => tOffer(`description.${key}`);
    return (
        <OfferWizardShell locale={locale} id={offerId}>
            <h1 className="mb-[30px] text-[1.625rem] leading-[120%] font-normal text-ink-secondary">{tOffer("Описание вакансии")}</h1>
            <DescriptionForm
                id={offerId}
                nextHref={routes.offerStep(locale, "what-to-do", offerId)}
                categories={categories}
                labels={{
                    title: d("Название мероприятия"),
                    categories: d("Категория приглашения"),
                    short: d("Краткое описание"),
                    shortHint: d("Не более 250 знаков"),
                    full: d("Полное описание"),
                    fullHint: d("Не более 3000 знаков"),
                    titleRequired: d("Поле название вакансии не может быть пустымы"),
                    required: d("Это поле является обязательным"),
                    coverRequired: d("Загрузите обложку"),
                    cover: {
                        add: d("Добавить фото обложки"),
                        change: d("Изменить"),
                        remove: d("Удалить"),
                        widthHint: d("Ширина фотографии для обложки не меньше 1280 пикселей"),
                        sizeHint: d("Изображение не должно превышать 5МБ"),
                        errors: Object.fromEntries(ERROR_KEYS.map((key) => [key, tOffer(key)])),
                        uploadError: d("Произошла ошибка с загрузкой изображения"),
                    },
                    gallery: {
                        add: t("Добавить фото"),
                        dropHere: t("Отпусти файлы здесь"),
                        tooMany: t("Нельзя загрузить больше 10 файлов"),
                        remove: "×",
                        close: t("Закрыть"),
                    },
                    gallerySaved: tVolunteer("volunteer-gallery.Галерея успешно обновлена"),
                    galleryError: tVolunteer("volunteer-gallery.Произошла ошибка с обновлением галереи"),
                    saved: tOffer("Данные успешно сохранены"),
                    error: tOffer("Произошла ошибка"),
                    save: d("Сохранить"),
                    next: tOffer("Дальше"),
                    unsaved: tOffer("У вас есть несохраненные изменения"),
                    loading: t("Загрузка"),
                    missing: tMain("Вакансия не найдена или произошла ошибка"),
                    assistant: {
                        title: tOffer("assistant.title"),
                        hint: tOffer("assistant.hint"),
                        placeholder: tOffer("assistant.placeholder"),
                        write: tOffer("assistant.write"),
                        writing: tOffer("assistant.writing"),
                        applied: tOffer("assistant.applied"),
                        whatToDo: tOffer("assistant.whatToDo"),
                        hello: tOffer("assistant.hello"),
                        missing: tOffer("assistant.missing"),
                        copy: tOffer("assistant.copy"),
                        copied: tOffer("assistant.copied"),
                        nextSteps: tOffer("assistant.nextSteps"),
                        limit: tOffer("assistant.limit"),
                        failed: tOffer("assistant.failed"),
                    },
                }}
            />
        </OfferWizardShell>
    );
}
