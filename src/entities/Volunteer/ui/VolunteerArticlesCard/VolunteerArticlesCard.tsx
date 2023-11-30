import cn from "classnames";
import React, { FC, memo, useMemo } from "react";

import { ArticleWidget } from "@/widgets/ArticleWidget";

import { Article } from "@/entities/Article";

import styles from "./VolunteerArticlesCard.module.scss";

interface VolunteerArticlesCardProps {
    articles?: Article[];
    className?: string;
}
const RENDER_TWO_ARTICLES = [0, 2];

export const VolunteerArticlesCard: FC<VolunteerArticlesCardProps> = memo(
    (props: VolunteerArticlesCardProps) => {
        const { className, articles } = props;
        const renderCards = useMemo(
            () => {
                if (!articles) {
                    return <span>Здесь появятся статьи волонтера.</span>;
                }
                return articles
                    .slice(...RENDER_TWO_ARTICLES)
                    .map((article, index) => (
                        <ArticleWidget article={article} key={index} />
                    ));
            },
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
