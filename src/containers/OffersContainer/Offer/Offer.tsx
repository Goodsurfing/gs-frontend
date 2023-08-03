import React, { FC } from "react";

import starIcon from "@/shared/assets/icons/star.svg";

import styles from "./Offer.module.scss";

interface OfferProps {
    title: string;
    location: string;
    type: string;
    rating: number;
    reviewsCount: number;
    sentCount: number;
    image: string;
}

const Offer: FC<OfferProps> = ({
    title,
    location,
    type,
    rating,
    reviewsCount,
    sentCount,
    image,
}) => (
    <div className={styles.item}>
        <img src={image} className={styles.image} alt={title} />
        <div className={styles.content}>
            <h4 className={styles.title}>{title}</h4>
            <p className={styles.location}>{location}</p>
            <p className={styles.type}>{type}</p>
        </div>
        <div className={styles.info}>
            <div className={styles.rating}>
                <img src={starIcon} alt="Rating" />
                <span>{rating}</span>
            </div>
            <div className={styles.reviews}>
                <span>
                    Отзывов:
                    {reviewsCount}
                </span>
            </div>
            <div className={styles.success}>
                <span>
                    Отправилось:
                    {sentCount}
                </span>
            </div>
        </div>
    </div>
);

export default Offer;
