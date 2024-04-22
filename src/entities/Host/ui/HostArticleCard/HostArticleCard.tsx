import cn from "classnames";
import React, { FC, memo, useMemo } from "react";

import { ArticleCard } from "@/entities/Article/";

import { Article } from "@/entities/Article";

import styles from "./HostArticleCard.module.scss";

interface HostArticleCardProps {
    articles: Article[];
    className?: string;
}
const RENDER_TWO_ARTICLES = [0, 2];

export const HostArticleCard: FC<HostArticleCardProps> = memo(
    (props: HostArticleCardProps) => {
        const { className, articles } = props;
        const renderCards = useMemo(
            () => articles
                .slice(...RENDER_TWO_ARTICLES)
                .map((article, index) => (
                    <ArticleCard article={article} key={index} />
                )),
            [articles],
        );

        return (
            <div className={cn(className, styles.wrapper)}>
                <h3>Статьи об организации</h3>
                <div className={styles.container}>{renderCards}</div>
            </div>
        );
    },
);
