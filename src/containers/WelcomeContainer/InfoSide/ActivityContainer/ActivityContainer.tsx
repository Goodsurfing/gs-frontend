import React, { FC } from "react";

import { useTranslation } from "react-i18next";
import ActivityItem from "@/containers/WelcomeContainer/InfoSide/ActivityContainer/ActivityItem/ActivityItem";
import defaultImage from "@/shared/assets/images/categories/a8.png";

import { useCategories } from "@/shared/data/categories";
import { getCategoriesPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { useGetPublicCategoriesVacancyQuery } from "@/entities/Admin";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import styles from "./ActivityContainer.module.scss";

const ActivityContainer: FC = () => {
    const { getTranslation } = useCategories();
    const { data: categoriesData, isLoading } = useGetPublicCategoriesVacancyQuery();
    const { locale } = useLocale();
    const { t, ready } = useTranslation();

    if (!ready || isLoading) {
        return (
            <div className={styles.wrapper}>
                <MiniLoader />
            </div>
        );
    }

    if (!categoriesData) {
        return null;
    }

    return (
        <div className={styles.wrapper}>
            {categoriesData.slice(0, 7).map((item, index) => (
                <ActivityItem
                    title={getTranslation(item.name) ?? ""}
                    image={getMediaContent(item.imagePath) ?? ""}
                    path={`/${locale}/offers-map?category=${item.id}`}
                    key={index}
                    locale={locale}
                />
            ))}
            <ActivityItem
                className={styles.other}
                title={t("category-offer.Другие категории")}
                image={defaultImage}
                path={getCategoriesPageUrl(locale)}
                locale={locale}
            />
        </div>
    );
};

export default ActivityContainer;
