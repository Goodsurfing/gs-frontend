import { useTranslation } from "react-i18next";

interface Item {
    title: string;
    description: string;
}

export const useAboutProjects = () => {
    const { t } = useTranslation("about-project");
    const principlesData: Item[] = [
        {
            title: t("Путешествия со смыслом"),
            description: t("Путешествуя можно развиваться, помогая другим"),
        },
        {
            title: t("Свобода информации"),
            description: t("Участники не должны платить за информацию о проектах"),
        },
        {
            title: t("Прозрачность"),
            description:
                t("У всех должна быть возможность оставить отзыв, написать сове мнение"),
        },
        {
            title: t("Стремиться к лучшему"),
            description:
                t("Становись лучше сравнивая себя с другими – единый рейтинг"),
        },
    ];

    const goodsurfingNowData: Item[] = [
        {
            title: "48 000",
            description: t("гудсёрферов"),
        },
        {
            title: "78",
            description: t("стран"),
        },
        {
            title: "567",
            description: t("вакансий"),
        },
        {
            title: "7 100",
            description: t("отзывов"),
        },
    ];

    return { principlesData, goodsurfingNowData };
};
