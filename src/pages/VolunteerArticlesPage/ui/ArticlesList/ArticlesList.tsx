import React, { FC, memo, useMemo } from "react";
import cn from "classnames";
import { ArticleCardType } from "@/entities/Article";
import { ArticleEditCard } from "../ArticleEditCard/ArticleEditCard";
import styles from "./ArticlesList.module.scss";

interface ArticlesListProps {
    articles: ArticleCardType[];
    className?: string
}

export const ArticlesList: FC<ArticlesListProps> = memo((props: ArticlesListProps) => {
    const { articles, className } = props;
    const renderArticles = useMemo(() => articles.map(
        (article, index) => <ArticleEditCard article={article} key={index} />,
    ), [articles]);

    return (
        <div className={cn(className, styles.wrapper)}>{renderArticles}</div>
    );
});
