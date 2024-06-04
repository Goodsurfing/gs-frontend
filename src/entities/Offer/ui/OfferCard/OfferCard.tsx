import React, { FC, memo } from "react";

import { Link } from "react-router-dom";
import cn from "classnames";
import like from "@/shared/assets/icons/offers/like.svg";
import star from "@/shared/assets/icons/offers/star.svg";
import defaultImage from "@/shared/assets/images/default-offer-image.svg";

import styles from "./OfferCard.module.scss";
import { getMainPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";

interface OfferCardProps {
    image?: string;
    title: string;
    location: string;
    category: string;
    rating: string;
    likes: string;
    reviews: string;
    went: string;
    description: string;
    link?: string;
    className?: string;
    isImageShow?: boolean;
}

export const OfferCard: FC<OfferCardProps> = memo((props: OfferCardProps) => {
    const {
        image,
        title,
        description,
        category,
        likes,
        location,
        rating,
        reviews,
        went,
        link,
        className,
        isImageShow = true,
    } = props;
    const { locale } = useLocale();

    return (
        <Link to={`/${locale}/${link}` || getMainPageUrl(locale)} className={cn(styles.wrapper, className)}>
            {
                isImageShow && (
                    <div className={styles.imageWrapper}>
                        <img src={image || defaultImage} alt="offer-img" />
                    </div>
                )
            }
            <div className={styles.content}>
                <p className={styles.title}>
                    {title.length > 88 ? `${title.slice(0, 88)}..` : title}
                </p>
                <div className={styles.subtitle}>
                    <span className={styles.location}>{location}</span>
                    <span className={styles.category}>{category}</span>
                </div>
                <div className={styles.stats}>
                    <div className={styles.rating}>
                        <img src={star} alt="star-icon" />
                        <span>{rating}</span>
                    </div>
                    <div className={styles.likes}>
                        <img src={like} alt="heart-icon" />
                        <span>{likes}</span>
                    </div>
                    <div className={styles.extraInfo}>
                        <span className={styles.review}>
                            Отзывов:
                            {" "}
                            {reviews}
                        </span>
                        <span className={styles.went}>
                            Отправились:
                            {" "}
                            {went}
                        </span>
                    </div>
                </div>
                <p className={styles.description}>
                    {description.length > 110
                        ? `${description.slice(0, 109)}..`
                        : description}
                </p>
            </div>
        </Link>
    );
});
