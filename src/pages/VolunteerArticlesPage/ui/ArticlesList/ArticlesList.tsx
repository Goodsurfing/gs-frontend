import React, { FC, memo, useMemo } from "react";
import cn from "classnames";
import { Article } from "@/entities/Article";
import styles from "./ArticlesList.module.scss";
import { ArticleWidget } from "@/widgets/ArticleWidget";

interface ArticlesListProps {
    articles: Article[];
    className?: string
}

export const ArticlesList: FC<ArticlesListProps> = memo((props: ArticlesListProps) => {
    const { articles, className } = props;
    const renderArticles = useMemo(() => articles.map(
        (article, index) => <ArticleWidget article={article} key={index} />,
    ), [articles]);

    return (
        <div className={cn(className, styles.wrapper)}>{renderArticles}</div>
    );
});
