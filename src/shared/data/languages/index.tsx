import { useTranslation } from "react-i18next";
import React from "react";
import { Language } from "@/types/languages";
import { IOptionLanguage, IOptionLevelLanguage } from "@/types/select";

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
            value: "spanish",
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

export const useLangsLevelsFilter = (): IOptionLevelLanguage[] => {
    const { t } = useTranslation("offer");

    return [
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

export const useFormatLanguages = (languages: Language[]) => {
    const { t } = useTranslation("offer");

    const languagesList: IOptionLanguage[] = [
        { label: t("whoNeeds.Не важен"), value: "not_matter" },
        { label: t("whoNeeds.Английский"), value: "english" },
        { label: t("whoNeeds.Русский"), value: "russian" },
        { label: t("whoNeeds.Испанский"), value: "spanish" },
        { label: t("whoNeeds.Немецкий"), value: "german" },
        { label: t("whoNeeds.Итальянский"), value: "italian" },
        { label: t("whoNeeds.Французский"), value: "french" },
        { label: t("whoNeeds.Португальский"), value: "portuguese" },
        { label: t("whoNeeds.Турецкий"), value: "turkish" },
        { label: t("whoNeeds.Арабский"), value: "arabic" },
        { label: t("whoNeeds.Шведский"), value: "swedish" },
        { label: t("whoNeeds.Датский"), value: "danish" },
        { label: t("whoNeeds.Норвежский"), value: "norwegian" },
        { label: t("whoNeeds.Украинский"), value: "ukrainian" },
        { label: t("whoNeeds.Иврит"), value: "hebrew" },
    ];

    const levelOptions: IOptionLevelLanguage[] = [
        { label: t("whoNeeds.Не важен"), value: "not_matter" },
        { label: t("whoNeeds.Начальный"), value: "beginner" },
        { label: t("whoNeeds.Элементарный"), value: "elementary" },
        {
            label: t("whoNeeds.Слабый средний уровень"),
            value: "lower_intermediate",
        },
        { label: t("whoNeeds.Выше среднего"), value: "upper_intermediate" },
        { label: t("whoNeeds.Продвинутый"), value: "advanced" },
        { label: t("whoNeeds.В совершенстве"), value: "proficiency" },
    ];

    if (languages.length === 0) return null;

    if (languages[0].language === "not_matter") {
        return t("whoNeeds.Не важен");
    }

    return languages
        .map(({ language, level }, index) => {
            const languageLabel = languagesList.find((l) => l.value === language)?.label
                || language;
            const levelLabel = levelOptions.find((l) => l.value === level)?.label
                || level;

            return (
                <React.Fragment key={index}>
                    <span>{languageLabel}</span>
                    /
                    <span>{levelLabel}</span>
                    {index < languages.length - 1 && ", "}
                </React.Fragment>
            );
        });
};

export const useLanguagesWithComma = (languages: Language[]) => {
    const { t } = useTranslation("offer");

    const languagesList: IOptionLanguage[] = [
        { label: t("whoNeeds.Не важен"), value: "not_matter" },
        { label: t("whoNeeds.Английский"), value: "english" },
        { label: t("whoNeeds.Русский"), value: "russian" },
        { label: t("whoNeeds.Испанский"), value: "spanish" },
        { label: t("whoNeeds.Немецкий"), value: "german" },
        { label: t("whoNeeds.Итальянский"), value: "italian" },
        { label: t("whoNeeds.Французский"), value: "french" },
        { label: t("whoNeeds.Португальский"), value: "portuguese" },
        { label: t("whoNeeds.Турецкий"), value: "turkish" },
        { label: t("whoNeeds.Арабский"), value: "arabic" },
        { label: t("whoNeeds.Шведский"), value: "swedish" },
        { label: t("whoNeeds.Датский"), value: "danish" },
        { label: t("whoNeeds.Норвежский"), value: "norwegian" },
        { label: t("whoNeeds.Украинский"), value: "ukrainian" },
        { label: t("whoNeeds.Иврит"), value: "hebrew" },
    ];

    const languagesWithoutLevel = languages.map(({ language }) => {
        const languageLabel = languagesList.find((l) => l.value === language);
        return languageLabel ? languageLabel.label : language;
    });

    const languagesWithComma = languagesWithoutLevel.join(", ");
    return languagesWithComma;
};
