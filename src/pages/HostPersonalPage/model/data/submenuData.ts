import { useTranslation } from "react-i18next";

export const useSubmenuItems = () => {
    const { t } = useTranslation("host");
    const submenuItems = [
        {
            text: t("personalHost.Об организации"),
            id: "1",
        },
        {
            text: t("personalHost.Вакансии"),
            id: "2",
        },
        {
            text: t("personalHost.Фото"),
            id: "3",
        },
        {
            text: t("personalHost.Видео"),
            id: "4",
        },
        {
            text: t("personalHost.Команда"),
            id: "5",
        },
        {
            text: t("personalHost.Отзывы"),
            id: "6",
        },
        {
            text: t("personalHost.Статьи"),
            id: "7",
        },
    ];

    return { submenuItems };
};
