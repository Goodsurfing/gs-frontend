import cn from "classnames";
import React, { FC, memo, useMemo } from "react";

import { useTranslation } from "react-i18next";
import { ArticleCard } from "@/entities/Article/";

import { Article } from "@/entities/Article";

import styles from "./HostArticleCard.module.scss";
import { getNewsPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";

interface HostArticleCardProps {
    articles: Article[];
    className?: string;
}
const RENDER_TWO_ARTICLES = [0, 2];

export const HostArticleCard: FC<HostArticleCardProps> = memo(
    (props: HostArticleCardProps) => {
        const { className, articles } = props;
        const { t } = useTranslation("host");
        const { locale } = useLocale();

        const renderCards = useMemo(
            () => articles
                .slice(...RENDER_TWO_ARTICLES)
                .map((article, index) => (
                    <ArticleCard
                        path={getNewsPersonalPageUrl(locale, article.id.toString())}
                        article={article}
                        key={index}
                    />
                )),
            [articles, locale],
        );

        return (
            <div className={cn(className, styles.wrapper)}>
                <h3>{t("personalHost.Статьи")}</h3>
                <div className={styles.container}>{renderCards}</div>
            </div>
        );
    },
);
