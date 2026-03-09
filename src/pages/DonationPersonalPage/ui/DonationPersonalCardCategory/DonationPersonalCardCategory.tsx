import cn from "classnames";
import { memo, useMemo } from "react";

import { useCategories } from "@/shared/data/categories";
import { CategoryNews } from "@/types/categories";
import styles from "./DonationPersonalCardCategory.module.scss";

interface DonationPersonalCardCategoryProps {
    className?: string;
    categories?: CategoryNews[];
}

export const DonationPersonalCardCategory = memo(
    (props: DonationPersonalCardCategoryProps) => {
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
