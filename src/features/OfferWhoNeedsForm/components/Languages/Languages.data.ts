import { IOptionLevelLanguage, IOptionLanguage } from "@/types/select";

export const allLangs: IOptionLanguage[] = [
    {
        label: "Не важен",
        value: "not_matter",
    },
    {
        label: "Английский",
        value: "Английский",
    },
    {
        label: "Русский",
        value: "Русский",
    },
    {
        label: "Немецкий",
        value: "Немецкий",
    },
];

export const langsLevels: IOptionLevelLanguage[] = [
    {
        label: "Не важен",
        value: "not_matter",
    },
    {
        label: "Начальный",
        value: "beginner",
    },
    {
        label: "Элементарный",
        value: "elementary",
    },
    {
        label: "Слабый средний уровень",
        value: "lower_intermediate",
    },
    {
        label: "Выше среднего",
        value: "upper_intermediate",
    },
    {
        label: "Продвинутый",
        value: "advanced",
    },
    {
        label: "В совершенстве",
        value: "proficiency",
    },
];
