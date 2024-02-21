import React, { FC } from "react";
import cn from "classnames";
import styles from "./ArticleFilter.module.scss";
import { Filter } from "@/features/Article";

interface FilterProps {
    className?: string;
}

export const ArticleFilter: FC<FilterProps> = (props) => {
    const { className } = props;
    return (
        <div className={cn(className, styles.wrapper)}>
            <Filter />
        </div>
    );
};
