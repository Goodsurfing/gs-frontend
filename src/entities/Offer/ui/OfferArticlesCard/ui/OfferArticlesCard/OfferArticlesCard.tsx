import cn from "classnames";
import React, { FC, memo, useMemo } from "react";

import { useTranslation } from "react-i18next";
import { ArticleCard } from "@/entities/Article/";

import { Article } from "@/entities/Article";

import styles from "./OfferArticlesCard.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getBlogPersonalPageUrl } from "@/shared/config/routes/AppUrls";

interface OfferArticlesCardProps {
    articles: Article[];
    className?: string;
}

export const OfferArticlesCard: FC<OfferArticlesCardProps> = memo(
    (props: OfferArticlesCardProps) => {
        const { articles, className } = props;
        const { t } = useTranslation("offer");
        const { locale } = useLocale();

        const renderCards = useMemo(
            () => articles
                .slice(0, 2)
                .map((article, index) => (
                    <ArticleCard
                        path={getBlogPersonalPageUrl(locale, article.id)}
                        article={article}
                        key={index}
                    />
                )),
            [articles, locale],
        );

        return (
            <div className={cn(className, styles.wrapper)} id="articles">
                <h3>{t("personalOffer.Статьи о вакансии")}</h3>
                <div className={styles.container}>{renderCards}</div>
            </div>
        );
    },
);
