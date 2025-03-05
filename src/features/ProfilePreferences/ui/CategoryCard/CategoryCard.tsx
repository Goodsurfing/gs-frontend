import cn from "classnames";
import React, { FC, memo } from "react";

import selectCheckIcon from "@/shared/assets/icons/select-check.svg";

import styles from "./CategoryCard.module.scss";

interface CategoryType {
    image: string;
    text: string;
}

interface CategoryCardProps {
    category: CategoryType;
    isSelect: boolean;
    onClick: () => void;
}

export const CategoryCard: FC<CategoryCardProps> = memo(
    ({ category, isSelect, onClick }: CategoryCardProps) => {
        const { image, text } = category;
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
                    {text}
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
