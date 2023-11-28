import React, { FC, memo } from "react";

import star from "@/shared/assets/icons/offers/star.svg";
import { Avatar } from "@/shared/ui/Avatar/Avatar";
import { Review } from "@/entities/Review";

import styles from "./ReviewWidget.module.scss";

interface ReviewWidgetProps {
    review: Review;
}

export const ReviewWidget: FC<ReviewWidgetProps> = memo(
    (props: ReviewWidgetProps) => {
        const {
            review: {
                avatar, name, rating, reviewText, date,
            },
        } = props;
        return (
            <div className={styles.wrapper}>
                <p className={styles.reviewText}>{reviewText}</p>
                <div className={styles.reviewInfo}>
                    <div className={styles.ratingContainer}>
                        <img src={star} alt="rating" />
                        <span className={styles.rating}>{rating}</span>
                    </div>
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
