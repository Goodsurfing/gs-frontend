import cn from "classnames";
import React, { FC, memo } from "react";

import selectCheckIcon from "@/shared/assets/icons/select-check.svg";

import { PreferenceCategory } from "../../model/types/profilePreferences";
import styles from "./CategoryCard.module.scss";

interface CategoryCardProps {
    category: PreferenceCategory;
    isSelect: boolean;
    onClick: () => void;
}

export const CategoryCard: FC<CategoryCardProps> = memo(
    ({ category, isSelect, onClick }: CategoryCardProps) => {
        const { image, title } = category;
        return (
            <div
                className={styles.wrapper}
                onClick={onClick}
                style={{ backgroundImage: `url(${image})` }}
            >
                <h4
                    className={cn(styles.title, {
                        [styles.selected]: isSelect,
                    })}
                >
                    {title}
                </h4>
                <img
                    src={selectCheckIcon}
                    alt="Select check icon"
                    className={cn(styles.checkIcon, {
                        [styles.check]: isSelect,
                    })}
                />
            </div>
        );
    },
);
