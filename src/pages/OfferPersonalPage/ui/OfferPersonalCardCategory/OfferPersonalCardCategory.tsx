import cn from "classnames";
import { memo, useMemo } from "react";

import { useCategories } from "@/shared/data/categories";
import styles from "./OfferPersonalCardCategory.module.scss";
import { CategoryType } from "@/types/categories";

interface OfferPersonalCardCategoryProps {
    className?: string;
    categories?: CategoryType[];
}

export const OfferPersonalCardCategory = memo(
    (props: OfferPersonalCardCategoryProps) => {
        const { className, categories } = props;
        const { getTranslation, getColorByCategory } = useCategories();

        const renderCategories = useMemo(
            () => categories?.map((category) => (
                <span
                    className={cn(styles.category, styles.text)}
                    style={{ backgroundColor: getColorByCategory(category) }}
                >
                    {getTranslation(category)}
                </span>
            )),
            [categories, getColorByCategory, getTranslation],
        );

        return (
            <div className={cn(className, styles.wrapper)}>
                {renderCategories}
            </div>
        );
    },
);
