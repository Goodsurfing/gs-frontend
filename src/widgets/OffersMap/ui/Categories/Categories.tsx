import React, { FC } from "react";
import cn from "classnames";
import styles from "./Categories.module.scss";

interface CategoriesProps {
    className?: string;
}

export const Categories: FC<CategoriesProps> = (props) => {
    const { className } = props;
    return (
        <div className={cn(styles.wrapper, className)}>Categories</div>
    );
};
