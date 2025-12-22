import cn from "classnames";
import { memo, useMemo } from "react";

import { useCategories } from "@/shared/data/categories";
import styles from "./OfferPersonalCardCategory.module.scss";
import { CategoryImageObject } from "@/types/categories";

interface OfferPersonalCardCategoryProps {
    className?: string;
    categories?: CategoryImageObject[];
}

export const OfferPersonalCardCategory = memo(
    (props: OfferPersonalCardCategoryProps) => {
        const { className, categories = [] } = props;
        const { getTranslation } = useCategories();

        const renderCategories = useMemo(
            () => categories.map((category) => (
                <span
                    className={cn(styles.category, styles.text)}
                    style={{ backgroundColor: category.color }}
                    key={category.id}
                >
                    {getTranslation(category.name)}
                </span>
            )),
            [categories, getTranslation],
        );

        return (
            <div className={cn(className, styles.wrapper)}>
                {renderCategories}
            </div>
        );
    },
);
