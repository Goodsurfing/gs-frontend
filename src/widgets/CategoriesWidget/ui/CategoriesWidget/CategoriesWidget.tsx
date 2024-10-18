import cn from "classnames";
import React, { FC, memo, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { useCategories } from "@/shared/data/categories";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";

import { Category } from "../Category/Category";
import styles from "./CategoriesWidget.module.scss";

interface CategoriesWidgetProps {
    className?: string;
}

export const CategoriesWidget: FC<CategoriesWidgetProps> = memo(
    (props: CategoriesWidgetProps) => {
        const { className } = props;
        const { tags } = useCategories();
        const { ready } = useTranslation();

        const renderCategories = useMemo(
            () => tags.map((category, index) => (
                <Category
                    className={styles.category}
                    title={category.text}
                    image={category.image}
                    vacancyNumber={9}
                    key={index}
                />
            )),
            [tags],
        );

        if (!ready) {
            return (
                <div className={cn(className, styles.wrapper)}>
                    <MiniLoader />
                </div>
            );
        }

        return (
            <div className={cn(className, styles.wrapper)}>
                <div className={styles.container}>{renderCategories}</div>
            </div>
        );
    },
);
