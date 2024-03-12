import { IOptionLevelLanguage, IOptionLanguage } from "@/types/select";

export const allLangs: IOptionLanguage[] = [
    {
        label: "Не важен",
        value: "not_matter",
    },
    {
        label: "Английский",
        value: "english",
    },
    {
        label: "Русский",
        value: "russian",
    },
    {
        label: "Испанский",
        value: "german",
    },
    {
        label: "Немецкий",
        value: "german",
    },
    {
        label: "Итальянский",
        value: "italian",
    },
    {
        label: "Французский",
        value: "french",
    },
    {
        label: "Португальский",
        value: "portuguese",
    },
    {
        label: "Турецкий",
        value: "turkish",
    },
    {
        label: "Арабский",
        value: "arabic",
    },
    {
        label: "Шведский",
        value: "swedish",
    },
    {
        label: "Датский",
        value: "danish",
    },
    {
        label: "Норвежский",
        value: "norwegian",
    },
    {
        label: "Украинский",
        value: "ukrainian",
    },
    {
        label: "Иврит",
        value: "hebrew",
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
