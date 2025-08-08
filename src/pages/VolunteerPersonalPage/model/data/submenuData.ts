import { useTranslation } from "react-i18next";

export const useSubmenuVolunteerItems = () => {
    const { t } = useTranslation("volunteer");
    const submenuItems = [
        {
            text: t("personalVolunteer.О себе"),
            id: "1",
        },
        {
            text: t("personalVolunteer.Заявки"),
            id: "2",
        },
        {
            text: t("personalVolunteer.Отзывы"),
            id: "3",
        },
        {
            text: t("personalVolunteer.Фото"),
            id: "4",
        },
        {
            text: t("personalVolunteer.Видео"),
            id: "5",
        },
        {
            text: t("personalVolunteer.Сертификаты"),
            id: "6",
        },
    // {
    //     text: "Статьи",
    //     id: "7",
    // },
    ];

    return { submenuItems };
};
