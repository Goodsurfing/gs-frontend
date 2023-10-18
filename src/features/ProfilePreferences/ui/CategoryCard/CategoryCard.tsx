import React, { FC } from "react";

import cn from "classnames";
import { PreferenceCategory } from "../../model/types/profilePreferences";
import selectCheckIcon from "@/shared/assets/icons/select-check.svg";

import styles from "./CategoryCard.module.scss";

interface CategoryCardProps {
    category:PreferenceCategory;
    isSelect:boolean;
    onClick: () => void
}

export const CategoryCard: FC<CategoryCardProps> = ({ category, isSelect, onClick }) => {
    const { image, title } = category;
    return (
        <div
            className={styles.wrapper}
            onClick={onClick}
            style={{ backgroundImage: `url(${image})` }}
        >
            <h4 className={styles.title}>{title}</h4>
            <img
                src={selectCheckIcon}
                alt="Select check icon"
                className={cn(styles.checkIcon, { [styles.check]: isSelect })}
            />
        </div>
    );
};
