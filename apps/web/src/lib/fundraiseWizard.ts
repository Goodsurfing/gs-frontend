import type { AmountLabels, MessagesLabels, WhenLabels } from "@/components/fundraise-wizard/FundraiseSteps";
import type { DescriptionLabels } from "@/components/offer-wizard/DescriptionForm";
import type { WhereLabels } from "@/components/offer-wizard/WhereForm";
import type { Locale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";

export const FUNDRAISE_STEPS = ["where", "when", "amount", "description", "auto-messages"] as const;
export type FundraiseStep = (typeof FUNDRAISE_STEPS)[number];

/** Заголовки шагов (FundraiseStepPage старого фронта) */
export async function fundraiseStepTitle(locale: Locale, step: FundraiseStep): Promise<string> {
    const th = await getTranslator(locale, "host");
    const keys: Record<FundraiseStep, string> = {
        where: "hostFundraiseWhere.title",
        when: "hostFundraiseWhen.title",
        amount: "hostFundraiseHowMany.title",
        description: "hostFundraiseDescription.title",
        "auto-messages": "hostFundraiseAutoMessages.title",
    };
    return th(keys[step]);
}

/** Тексты, общие для всех шагов */
async function common(locale: Locale) {
    const [t, tOffer] = await Promise.all([getTranslator(locale), getTranslator(locale, "offer")]);
    return {
        t,
        tOffer,
        save: tOffer("Сохранить"),
        next: tOffer("Дальше"),
        error: tOffer("Произошла ошибка"),
        loading: t("Загрузка"),
        missing: t("Что-то пошло не так"),
        unsaved: tOffer("У вас есть несохраненные изменения"),
    };
}

export async function fundraiseWhereLabels(locale: Locale): Promise<WhereLabels> {
    const [c, th] = await Promise.all([common(locale), getTranslator(locale, "host")]);
    return {
        address: c.tOffer("where.Введите адрес"),
        noOptions: c.tOffer("where.Точек на карте не найдено"),
        required: th("hostFundraiseWhere.addressRequired"),
        saved: th("hostFundraiseWhere.saved"),
        error: c.error,
        save: c.save,
        next: c.next,
        unsaved: c.unsaved,
        // Подсказки MUI старого фронта не переводились — английские во всех языках
        clear: "Clear",
        open: "Open",
        close: "Close",
        loading: c.loading,
        missing: c.missing,
    };
}

export async function fundraiseWhenLabels(locale: Locale): Promise<WhenLabels> {
    const [c, th] = await Promise.all([common(locale), getTranslator(locale, "host")]);
    return {
        date: th("hostFundraiseWhen.dateLabel"),
        notSet: c.t("Не задано"),
        untilAmount: th("hostFundraiseWhen.untilAmount"),
        saved: th("hostFundraiseWhen.saved"),
        save: c.save,
        next: c.next,
        error: c.error,
        loading: c.loading,
        missing: c.missing,
    };
}

export async function fundraiseAmountLabels(locale: Locale): Promise<AmountLabels> {
    const [c, th] = await Promise.all([common(locale), getTranslator(locale, "host")]);
    return {
        amount: th("hostFundraiseHowMany.amountLabel"),
        minAmount: th("hostFundraiseHowMany.minAmountLabel"),
        hint: th("hostFundraiseHowMany.hint"),
        saved: th("hostFundraiseHowMany.saved"),
        save: c.save,
        next: c.next,
        error: c.error,
        loading: c.loading,
        missing: c.missing,
    };
}

const COVER_ERRORS = [
    "description.Неверный формат файла",
    "description.Размер файла превышает 5МБ",
    "description.Неверный размер изображения. Минимум 1280x720",
];

/** Описание сбора: поля и тексты — как у описания вакансии (InviteDescriptionForm старого фронта) */
export async function fundraiseDescriptionLabels(locale: Locale): Promise<DescriptionLabels> {
    const [c, th, tVolunteer] = await Promise.all([common(locale), getTranslator(locale, "host"), getTranslator(locale, "volunteer")]);
    const d = (key: string) => c.tOffer(`description.${key}`);
    return {
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
            errors: Object.fromEntries(COVER_ERRORS.map((key) => [key, c.tOffer(key)])),
            uploadError: d("Произошла ошибка с загрузкой изображения"),
        },
        gallery: {
            add: c.t("Добавить фото"),
            dropHere: c.t("Отпусти файлы здесь"),
            tooMany: c.t("Нельзя загрузить больше 10 файлов"),
            remove: "×",
            close: c.t("Закрыть"),
        },
        gallerySaved: tVolunteer("volunteer-gallery.Галерея успешно обновлена"),
        galleryError: tVolunteer("volunteer-gallery.Произошла ошибка с обновлением галереи"),
        saved: th("hostFundraiseDescription.saved"),
        error: c.error,
        save: d("Сохранить"),
        next: c.next,
        unsaved: c.unsaved,
        loading: c.loading,
        missing: c.missing,
    };
}

export async function fundraiseMessagesLabels(locale: Locale): Promise<MessagesLabels> {
    const [c, th] = await Promise.all([common(locale), getTranslator(locale, "host")]);
    const m = (key: string) => th(`hostFundraiseAutoMessages.${key}`);
    return {
        wordsTitle: m("wordsTitle"),
        wordsDescription: m("wordsDescription"),
        max: m("max"),
        required: m("required"),
        addLinkTitle: m("addLinkTitle"),
        addLinkDescription: m("addLinkDescription"),
        addLink: m("addLinkButton"),
        removeLink: c.t("Удалить"),
        publish: m("publish"),
        saveChanges: m("saveChanges"),
        saveDraft: m("saveDraft"),
        published: m("published"),
        savedDraft: m("savedDraft"),
        error: c.error,
        loading: c.loading,
        missing: c.missing,
    };
}
