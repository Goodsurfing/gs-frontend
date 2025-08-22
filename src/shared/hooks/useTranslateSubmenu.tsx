import { useTranslation } from "react-i18next";

export const useTranslateSubmenu = () => {
    const { t } = useTranslation("offer");

    const SubmenuItemsOffer = [
        {
            text: t("personalOffer.Описание", "Описание"),
            id: "description",
        },
        {
            text: t("personalOffer.Фото", "Фото"),
            id: "gallery",
        },
        {
            text: t("personalOffer.Что делать", "Что делать"),
            id: "whatToDo",
        },
        {
            text: t("personalOffer.Условия", "Условия"),
            id: "terms",
        },
        {
            text: t("personalOffer.Отзывы", "Отзывы"),
            id: "review",
        },
        {
            text: t("personalOffer.Организация", "Организация"),
            id: "organization",
        },
        {
            text: t("personalOffer.Участники", "Участники"),
            id: "participants",
        },
        // {
        //     text: t("personalOffer.Статьи", "Статьи"),
        //     id: "articles",
        // },
    ];

    return { SubmenuItemsOffer };
};
