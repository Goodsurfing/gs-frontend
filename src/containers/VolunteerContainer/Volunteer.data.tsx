import { useTranslation } from "react-i18next";

export const useVolunteerData = () => {
    const { t } = useTranslation("main");

    const volunteerData = [
        {
            number: 1,
            title: "Поиск по карте",
        },
        {
            number: 2,
            title: "Встречи с гудсёрферами",
        },
        {
            number: 3,
            title: "Поиск попутчиков",
        },
        {
            number: 4,
            title: "Общение на сервисе",
        },
        {
            number: 5,
            title: "Отзывы волонтёров",
        },
        {
            number: 6,
            title: "Система рейтинга",
        },
        {
            number: 7,
            title: "Лист пожеланий",
        },
    ];

    const translatedData = volunteerData.map((item) => ({
        ...item,
        title: t(item.title),
    }));

    return translatedData;
};
