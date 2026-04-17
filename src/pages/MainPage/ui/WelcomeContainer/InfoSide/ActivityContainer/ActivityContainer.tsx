import React, { FC } from "react";

import { useTranslation } from "react-i18next";
import cn from "classnames";
import defaultImage from "@/shared/assets/images/categories/a8.png";

import { getCategoriesPageUrl } from "@/shared/config/routes/AppUrls";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { useGetPublicCategoriesVacancyQuery } from "@/entities/Admin";
import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";
import ActivityItem from "./ActivityItem/ActivityItem";
import styles from "./ActivityContainer.module.scss";

interface ActivityContainerProps {
    locale: Locale;
    className?: string;
}

const ActivityContainer: FC<ActivityContainerProps> = (props) => {
    const { locale, className } = props;
    const {
        data: categoriesData,
        isLoading,
    } = useGetPublicCategoriesVacancyQuery({ lang: locale });
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
        <div className={cn(styles.wrapper, className)}>
            {categoriesData.slice(0, 3).map((item, index) => (
                <ActivityItem
                    title={item.name}
                    image={item.imagePath}
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
