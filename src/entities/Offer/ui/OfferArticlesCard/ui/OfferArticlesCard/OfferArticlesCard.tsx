import React, { FC, memo, useMemo } from "react";

import cn from "classnames";
import { OfferArticle } from "@/entities/Offer/model/types/offerArticle";
import { OfferArticleCard } from "../OfferArticleCard/OfferArticleCard";
import styles from "./OfferArticlesCard.module.scss";

interface OfferArticlesCardProps {
    articles: OfferArticle[];
    className?: string;
}

export const OfferArticlesCard: FC<OfferArticlesCardProps> = memo((
    props: OfferArticlesCardProps,
) => {
    const { articles, className } = props;

    const renderCards = useMemo(
        () => articles
            .slice(0, 2)
            .map((article, index) => (
                <OfferArticleCard article={article} key={index} />
            )),
        [articles],
    );

    return (
        <div className={cn(className, styles.wrapper)}>
            <h3>Статьи о вакансии</h3>
            <div className={styles.container}>
                {renderCards}
            </div>
        </div>
    );
});
