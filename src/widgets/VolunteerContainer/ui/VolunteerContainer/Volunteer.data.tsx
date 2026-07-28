import { useTranslation } from "react-i18next";

export const useVolunteerData = () => {
    const { t } = useTranslation("main");

    const volunteerData = [
        {
            number: 1,
            title: t("Поиск по карте"),
        },
        {
            number: 2,
            title: t("Встречи с гудсёрферами"),
        },
        {
            number: 3,
            title: t("Поиск попутчиков"),
        },
        {
            number: 4,
            title: t("Общение на сервисе"),
        },
        {
            number: 5,
            title: t("Отзывы волонтёров"),
        },
        {
            number: 6,
            title: t("Система рейтинга"),
        },
        {
            number: 7,
            title: t("Лист пожеланий"),
        },
    ];

    // const translatedData = volunteerData.map((item) => ({
    //     ...item,
    //     title: t(item.title),
    // }));

    return volunteerData;
};
