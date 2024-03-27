import { useTranslation } from "react-i18next";

import { InviteCategoryType } from "../model/types/offerCategory";

export const useTags = () => {
    const { t } = useTranslation("translation");
    const tags: InviteCategoryType[] = [
        {
            value: "hostels",
            color: "#E0EBC6",
            text: t("category-offer.Хостелы"),
        },
        {
            value: "reserves_and_parks",
            color: "#C3A3E9",
            text: t("category-offer.Заповедники и парки"),
        },
        {
            value: "farm",
            color: "#C6E7E6",
            text: t("category-offer.Ферма"),
        },
        {
            value: "animals",
            color: "#F7EBAB",
            text: t("category-offer.Животные"),
        },
        {
            value: "teaching",
            color: "#E3C2CA",
            text: t("category-offer.Преподавание"),
        },
        {
            value: "children",
            color: "#C4D8E9",
            text: t("category-offer.Дети"),
        },
        {
            value: "charity",
            color: "#EED6AC",
            text: t("category-offer.Благотворительность"),
        },
        {
            value: "sports",
            color: "#DBB5D4",
            text: t("category-offer.Спорт"),
        },
        {
            value: "art",
            color: "#F7EBAB",
            text: t("category-offer.Искусство"),
        },
        {
            value: "archeology",
            color: "#EBC1FA",
            text: t("category-offer.Археология"),
        },
        {
            value: "online",
            color: "#C0DAEB",
            text: t("category-offer.Онлайн"),
        },
        {
            value: "other",
            color: "#D7C0A8",
            text: t("category-offer.Другое"),
        },
    ];

    return { tags };
};
