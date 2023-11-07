import React, { FC, memo } from "react";

import { OfferArticle } from "@/entities/Offer/model/types/offerArticle";

import styles from "./OfferArticleCard.module.scss";

interface OfferArticleCardProps {
    article: OfferArticle;
}

export const OfferArticleCard: FC<OfferArticleCardProps> = memo((
    props: OfferArticleCardProps,
) => {
    const {
        article: {
            image, title, description, date, likes, comments, tag,
        },
    } = props;

    return (
        <div className={styles.wrapper}>
            <img src={image} alt={title} />
            <span className={styles.title}>{title}</span>
            <div className={styles.container}>
                <span className={styles.date}>{date}</span>
                <div className={styles.tag}>{tag}</div>
            </div>
            <p>{description}</p>
            <div className={styles.container}>
                <span>{likes}</span>
                <span>{comments}</span>
            </div>
        </div>
    );
});
