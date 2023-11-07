import React, { FC, memo } from "react";

import { OfferReview } from "@/entities/Offer/model/types/offerReview";

import { Avatar } from "@/shared/ui/Avatar/Avatar";

import styles from "./OfferReviewCard.module.scss";

interface OfferReviewCardProps {
    review: OfferReview;
}

export const OfferReviewCard: FC<OfferReviewCardProps> = memo(
    (props: OfferReviewCardProps) => {
        const {
            review: {
                avatar, name, rating, reviewText, date,
            },
        } = props;
        return (
            <div className={styles.wrapper}>
                <p className={styles.reviewText}>{reviewText}</p>
                <div className={styles.reviewInfo}>
                    <span>{rating}</span>
                    <Avatar icon={avatar} className={styles.avatar} />
                    <span className={styles.name}>{name}</span>
                    <span className={styles.date}>
                        /
                        {" "}
                        {date}
                    </span>
                </div>
            </div>
        );
    },
);
