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
            value: "English",
        },
        {
            label: t("whoNeeds.Русский"),
            value: "Русский",
        },
        {
            label: t("whoNeeds.Испанский"),
            value: "Español",
        },
        {
            label: t("whoNeeds.Китайский"),
            value: "中文",
        },
        {
            label: t("whoNeeds.Немецкий"),
            value: "Deutsch",
        },
        {
            label: t("whoNeeds.Итальянский"),
            value: "Italiano",
        },
        {
            label: t("whoNeeds.Французский"),
            value: "Français",
        },
        {
            label: t("whoNeeds.Португальский"),
            value: "Português",
        },
        {
            label: t("whoNeeds.Турецкий"),
            value: "Türkçe",
        },
        {
            label: t("whoNeeds.Арабский"),
            value: "العربية",
        },
        {
            label: t("whoNeeds.Шведский"),
            value: "Svenska",
        },
        {
            label: t("whoNeeds.Датский"),
            value: "Dansk",
        },
        {
            label: t("whoNeeds.Норвежский"),
            value: "Norsk",
        },
        {
            label: t("whoNeeds.Украинский"),
            value: "Українська",
        },
        {
            label: t("whoNeeds.Иврит"),
            value: "עברית",
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
        { label: t("whoNeeds.Английский"), value: "English" },
        { label: t("whoNeeds.Русский"), value: "Русский" },
        { label: t("whoNeeds.Испанский"), value: "Español" },
        { label: t("whoNeeds.Китайский"), value: "中文" },
        { label: t("whoNeeds.Немецкий"), value: "Deutsch" },
        { label: t("whoNeeds.Итальянский"), value: "Italiano" },
        { label: t("whoNeeds.Французский"), value: "Français" },
        { label: t("whoNeeds.Португальский"), value: "Português" },
        { label: t("whoNeeds.Турецкий"), value: "Türkçe" },
        { label: t("whoNeeds.Арабский"), value: "العربية" },
        { label: t("whoNeeds.Шведский"), value: "Svenska" },
        { label: t("whoNeeds.Датский"), value: "Dansk" },
        { label: t("whoNeeds.Норвежский"), value: "Norsk" },
        { label: t("whoNeeds.Украинский"), value: "Українська" },
        { label: t("whoNeeds.Иврит"), value: "עברית" },
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
        .map(({ language, languageLevel }, index) => {
            const languageLabel = languagesList.find((l) => l.value === language)?.label
                || language;
            const levelLabel = levelOptions.find((l) => l.value === languageLevel)?.label
                || languageLevel;

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
        { label: t("whoNeeds.Английский"), value: "English" },
        { label: t("whoNeeds.Русский"), value: "Русский" },
        { label: t("whoNeeds.Испанский"), value: "Español" },
        { label: t("whoNeeds.Китайский"), value: "中文" },
        { label: t("whoNeeds.Немецкий"), value: "Deutsch" },
        { label: t("whoNeeds.Итальянский"), value: "Italiano" },
        { label: t("whoNeeds.Французский"), value: "Français" },
        { label: t("whoNeeds.Португальский"), value: "Português" },
        { label: t("whoNeeds.Турецкий"), value: "Türkçe" },
        { label: t("whoNeeds.Арабский"), value: "العربية" },
        { label: t("whoNeeds.Шведский"), value: "Svenska" },
        { label: t("whoNeeds.Датский"), value: "Dansk" },
        { label: t("whoNeeds.Норвежский"), value: "Norsk" },
        { label: t("whoNeeds.Украинский"), value: "Українська" },
        { label: t("whoNeeds.Иврит"), value: "עברית" },
    ];

    const languagesWithoutLevel = languages.map(({ language }) => {
        const languageLabel = languagesList.find((l) => l.value === language);
        return languageLabel ? languageLabel.label : language;
    });

    const languagesWithComma = languagesWithoutLevel.join(", ");
    return languagesWithComma;
};
