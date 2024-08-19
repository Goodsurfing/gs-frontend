import { useTranslation } from "react-i18next";

export const useTranslateSubmenu = () => {
    const { t } = useTranslation("offer");

    const SubmenuItemsOffer = [
        {
            text: t("personalOffer.Описание", "Описание"),
            id: "1",
        },
        {
            text: t("personalOffer.Фото", "Фото"),
            id: "2",
        },
        {
            text: t("personalOffer.Что делать", "Что делать"),
            id: "3",
        },
        {
            text: t("personalOffer.Условия", "Условия"),
            id: "4",
        },
        {
            text: t("personalOffer.Отзывы", "Отзывы"),
            id: "5",
        },
        {
            text: t("personalOffer.Организация", "Организация"),
            id: "6",
        },
        {
            text: t("personalOffer.Участники", "Участники"),
            id: "7",
        },
        {
            text: t("personalOffer.Статьи", "Статьи"),
            id: "8",
        },
    ];

    return { SubmenuItemsOffer };
};
