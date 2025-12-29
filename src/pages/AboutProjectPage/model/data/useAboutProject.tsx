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

    return { principlesData };
};
