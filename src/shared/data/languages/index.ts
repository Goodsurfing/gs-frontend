import { useTranslation } from "react-i18next";
import { IOptionLevelLanguage, IOptionLanguage } from "@/types/select";

export const useAllLangs = (): IOptionLanguage[] => {
    const { t } = useTranslation("offer");
    return [
        {
            label: t("whoNeeds.Не важен"),
            value: "not_matter",
        },
        {
            label: t("whoNeeds.Английский"),
            value: "english",
        },
        {
            label: t("whoNeeds.Русский"),
            value: "russian",
        },
        {
            label: t("whoNeeds.Испанский"),
            value: "german",
        },
        {
            label: t("whoNeeds.Немецкий"),
            value: "german",
        },
        {
            label: t("whoNeeds.Итальянский"),
            value: "italian",
        },
        {
            label: t("whoNeeds.Французский"),
            value: "french",
        },
        {
            label: t("whoNeeds.Португальский"),
            value: "portuguese",
        },
        {
            label: t("whoNeeds.Турецкий"),
            value: "turkish",
        },
        {
            label: t("whoNeeds.Арабский"),
            value: "arabic",
        },
        {
            label: t("whoNeeds.Шведский"),
            value: "swedish",
        },
        {
            label: t("whoNeeds.Датский"),
            value: "danish",
        },
        {
            label: t("whoNeeds.Норвежский"),
            value: "norwegian",
        },
        {
            label: t("whoNeeds.Украинский"),
            value: "ukrainian",
        },
        {
            label: t("whoNeeds.Иврит"),
            value: "hebrew",
        },
    ];
};

export const useAllLangsFilter = (): IOptionLanguage[] => {
    const { t } = useTranslation("offer");
    return [
        {
            label: t("whoNeeds.Английский"),
            value: "english",
        },
        {
            label: t("whoNeeds.Русский"),
            value: "russian",
        },
        {
            label: t("whoNeeds.Испанский"),
            value: "german",
        },
        {
            label: t("whoNeeds.Немецкий"),
            value: "german",
        },
        {
            label: t("whoNeeds.Итальянский"),
            value: "italian",
        },
        {
            label: t("whoNeeds.Французский"),
            value: "french",
        },
        {
            label: t("whoNeeds.Португальский"),
            value: "portuguese",
        },
        {
            label: t("whoNeeds.Турецкий"),
            value: "turkish",
        },
        {
            label: t("whoNeeds.Арабский"),
            value: "arabic",
        },
        {
            label: t("whoNeeds.Шведский"),
            value: "swedish",
        },
        {
            label: t("whoNeeds.Датский"),
            value: "danish",
        },
        {
            label: t("whoNeeds.Норвежский"),
            value: "norwegian",
        },
        {
            label: t("whoNeeds.Украинский"),
            value: "ukrainian",
        },
        {
            label: t("whoNeeds.Иврит"),
            value: "hebrew",
        },
    ];
};

export const useLangsLevels = (): IOptionLevelLanguage[] => {
    const { t } = useTranslation("offer");

    return [
        {
            label: t("whoNeeds.Не важен"),
            value: "not_matter",
        },
        {
            label: t("whoNeeds.Начальный"),
            value: "beginner",
        },
        {
            label: t("whoNeeds.Элементарный"),
            value: "elementary",
        },
        {
            label: t("whoNeeds.Слабый средний уровень"),
            value: "lower_intermediate",
        },
        {
            label: t("whoNeeds.Выше среднего"),
            value: "upper_intermediate",
        },
        {
            label: t("whoNeeds.Продвинутый"),
            value: "advanced",
        },
        {
            label: t("whoNeeds.В совершенстве"),
            value: "proficiency",
        },
    ];
};
