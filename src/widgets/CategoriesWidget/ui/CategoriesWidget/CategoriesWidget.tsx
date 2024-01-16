import cn from "classnames";
import React, { FC, memo, useMemo } from "react";

import { categoriesData } from "../../model/data/categories";
import { Category } from "../Category/Category";
import styles from "./CategoriesWidget.module.scss";
import { useTranslation } from "react-i18next";

interface CategoriesWidgetprops {
    className?: string;
}

export const CategoriesWidget: FC<CategoriesWidgetprops> = memo((props: CategoriesWidgetprops) => {
    const { className } = props;
    const {t} = useTranslation("")
    const renderCategories = useMemo(() => categoriesData.map((category, index) => (
        <Category
            className={styles.category}
            title={category.title}
            image={category.image}
            vacancyNumber={category.numberVacancies}
            key={index}
        />
    )), []);

    return (
        <div className={cn(className, styles.wrapper)}>
            <div className={styles.container}>{renderCategories}</div>
        </div>
    );
});
