import { useTranslation } from "react-i18next";

export const useSubmenuVolunteerItems = () => {
    const { t } = useTranslation("profile");
    const submenuItems = [
        {
            text: t("personal.О себе"),
            id: "1",
        },
        {
            text: t("personal.Умения"),
            id: "1",
        },
        {
            text: t("personal.Вакансии"),
            id: "2",
        },
        {
            text: t("personal.Фото"),
            id: "4",
        },
        {
            text: t("personal.Видео"),
            id: "5",
        },
        {
            text: t("personal.Сертификаты"),
            id: "6",
        },
        {
            text: t("personal.Отзывы"),
            id: "3",
        },
    // {
    //     text: "Статьи",
    //     id: "7",
    // },
    ];

    return { submenuItems };
};
