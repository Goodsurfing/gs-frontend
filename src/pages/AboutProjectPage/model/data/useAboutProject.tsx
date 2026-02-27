import { useTranslation } from "react-i18next";
import princip1 from "@/shared/assets/images/about-project/icon_about_1.png";
import princip2 from "@/shared/assets/images/about-project/icon_about_2.png";
import princip3 from "@/shared/assets/images/about-project/icon_about_3.png";
import princip4 from "@/shared/assets/images/about-project/icon_about_4.png";

interface Item {
    image: string;
    title: string;
    description: string;
}

export const useAboutProjects = () => {
    const { t } = useTranslation("about-project");
    const principlesData: Item[] = [
        {
            image: princip1,
            title: t("Путешествия со смыслом"),
            description: t("Путешествуя можно развиваться, помогая другим"),
        },
        {
            image: princip2,
            title: t("Свобода информации"),
            description: t("Участники не должны платить за информацию о проектах"),
        },
        {
            image: princip3,
            title: t("Прозрачность"),
            description:
                t("У всех должна быть возможность оставить отзыв, написать сове мнение"),
        },
        {
            image: princip4,
            title: t("Стремиться к лучшему"),
            description:
                t("Становись лучше сравнивая себя с другими – единый рейтинг"),
        },
    ];

    return { principlesData };
};
