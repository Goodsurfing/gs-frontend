import React, { FC, useMemo } from "react";
import cn from "classnames";
import { Article } from "@/entities/Article";
import styles from "./NewsList.module.scss";
import { ArticleCard } from "@/entities/Article/";

interface NewsListProps {
    data?: Article[]
    className?: string;
}

export const NewsList: FC<NewsListProps> = (props) => {
    const { data, className } = props;
    const renderNews = useMemo(() => data?.map((article, key) => (
        <ArticleCard
            article={article}
            key={key}
            className={styles.article}
        />
    )), [data]);

    if (!data) {
        return (
            <div>Новостей не было найдено</div>
        );
    }

    return (
        <div className={cn(className, styles.wrapper)}>{renderNews}</div>
    );
};
