import React, { FC, memo } from "react";

import { useNavigate } from "react-router-dom";
import star from "@/shared/assets/icons/offers/star.svg";
import { Avatar } from "@/shared/ui/Avatar/Avatar";

import styles from "./ReviewWidget.module.scss";

interface ReviewWidgetProps {
    reviewText: string;
    stars: number;
    avatar?: string;
    name: string;
    url: string;
}

export const ReviewWidget: FC<ReviewWidgetProps> = memo(
    (props: ReviewWidgetProps) => {
        const {
            reviewText, stars, name, avatar, url,
        } = props;
        const navigate = useNavigate();

        const navigateTo = () => {
            navigate(url);
        };

        return (
            <div className={styles.wrapper}>
                <p className={styles.reviewText}>{reviewText}</p>
                <div className={styles.reviewInfo}>
                    <div className={styles.ratingContainer}>
                        <img src={star} alt="rating" />
                        <span className={styles.rating}>{stars}</span>
                    </div>
                    <Avatar icon={avatar} className={styles.avatar} onClick={navigateTo} />
                    <span className={styles.name} onClick={navigateTo}>{name}</span>
                    {/* <span className={styles.date}>
                        /
                        {" "}
                        {date}
                    </span> */}
                </div>
            </div>
        );
    },
);
