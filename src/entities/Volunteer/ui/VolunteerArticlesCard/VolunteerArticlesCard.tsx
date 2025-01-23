import cn from "classnames";
import React, { FC, memo, useMemo } from "react";

import { ArticleCard } from "@/entities/Article/";

import { Article } from "@/entities/Article";

import styles from "./VolunteerArticlesCard.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getBlogPersonalPageUrl } from "@/shared/config/routes/AppUrls";

interface VolunteerArticlesCardProps {
    articles?: Article[];
    className?: string;
}
const RENDER_TWO_ARTICLES = [0, 2];

export const VolunteerArticlesCard: FC<VolunteerArticlesCardProps> = memo(
    (props: VolunteerArticlesCardProps) => {
        const { className, articles } = props;
        const { locale } = useLocale();

        const renderCards = useMemo(
            () => {
                if (!articles) {
                    return <span>Здесь появятся статьи волонтера.</span>;
                }
                return articles
                    .slice(...RENDER_TWO_ARTICLES)
                    .map((article, index) => (
                        <ArticleCard
                            path={getBlogPersonalPageUrl(locale, article.id)}
                            article={article}
                            key={index}
                        />
                    ));
            },
            [articles, locale],
        );

        return (
            <div className={cn(className, styles.wrapper)}>
                <h3>Статьи об организации</h3>
                <div className={styles.container}>{renderCards}</div>
            </div>
        );
    },
);
