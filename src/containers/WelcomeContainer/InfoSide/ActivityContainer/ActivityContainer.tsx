import React, { FC } from "react";

import { useTranslation } from "react-i18next";
import ActivityItem from "@/containers/WelcomeContainer/InfoSide/ActivityContainer/ActivityItem/ActivityItem";
import defaultImage from "@/shared/assets/images/categories/a8.png";

import styles from "./ActivityContainer.module.scss";
import { useCategories } from "@/shared/data/categories";
import { getCategoriesPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";

const ActivityContainer: FC = () => {
    const { tags } = useCategories();
    const { locale } = useLocale();
    const { t, ready } = useTranslation();

    if (!ready) {
        return (
            <div className={styles.wrapper}>
                <MiniLoader />
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            {tags.slice(0, 7).map((item, index) => (
                <ActivityItem
                    title={item.text}
                    image={item.image}
                    path={`/${locale}${item.path}`}
                    key={index}
                />
            ))}
            <ActivityItem
                className={styles.other}
                title={t("category-offer.Другие категории")}
                image={defaultImage}
                path={getCategoriesPageUrl(locale)}
            />
        </div>
    );
};

export default ActivityContainer;
