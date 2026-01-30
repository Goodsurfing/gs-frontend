import cn from "classnames";
import React, { FC, memo } from "react";
import { useTranslation } from "react-i18next";

import { useCategories } from "@/shared/data/categories";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";

import { Category } from "../Category/Category";
import { useGetPublicCategoriesVacancyQuery } from "@/entities/Admin";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import styles from "./CategoriesWidget.module.scss";
import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";

interface CategoriesWidgetProps {
    className?: string;
    locale: Locale;
}

export const CategoriesWidget: FC<CategoriesWidgetProps> = memo(
    (props: CategoriesWidgetProps) => {
        const { className, locale } = props;
        const { getTranslation } = useCategories();
        const {
            data: categoriesData,
            isLoading,
        } = useGetPublicCategoriesVacancyQuery({ lang: locale });
        const { ready } = useTranslation();

        if (!ready || isLoading) {
            return (
                <div className={cn(className, styles.wrapper)}>
                    <MiniLoader />
                </div>
            );
        }

        if (!categoriesData) {
            return null;
        }

        const renderCategories = () => categoriesData.map((category, index) => (
            <Category
                className={styles.category}
                title={getTranslation(category.name) ?? ""}
                image={getMediaContent(category.imagePath)}
                vacancyNumber={category.vacancyCount}
                key={index}
                link={`/offers-map?category=${category.id}`}
                locale={locale}
            />
        ));

        return (
            <div className={cn(className, styles.wrapper)}>
                <div className={styles.container}>{renderCategories()}</div>
            </div>
        );
    },
);
