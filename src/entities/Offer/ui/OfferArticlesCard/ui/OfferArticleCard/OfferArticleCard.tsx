import React, { FC, memo } from "react";

import { OfferArticle } from "@/entities/Offer/model/types/offerArticle";
import like from "@/shared/assets/icons/ThumbsUp.svg";
import comment from "@/shared/assets/icons/comment.svg";

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
            <img className={styles.image} src={image} alt={title} />
            <span className={styles.title}>{title}</span>
            <div className={styles.container}>
                <span className={styles.date}>{date}</span>
                <div className={styles.tag} style={{ backgroundColor: "#E0EBC6" }}>{tag}</div>
            </div>
            <p className={styles.description}>{description}</p>
            <div className={styles.infoContainer}>
                <img className={styles.likeIcon} src={like} alt="likes" />
                <span>{likes}</span>
                <img className={styles.commentIcon} src={comment} alt="comments" />
                <span>{comments}</span>
            </div>
        </div>
    );
});
