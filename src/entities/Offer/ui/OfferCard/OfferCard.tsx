import React, { FC, memo } from "react";

import { Link } from "react-router-dom";
import cn from "classnames";
import { ReactSVG } from "react-svg";
import like from "@/shared/assets/icons/offers/like.svg";
import star from "@/shared/assets/icons/offers/star.svg";
import defaultImage from "@/shared/assets/images/default-offer-image.svg";

import styles from "./OfferCard.module.scss";
import { getMainPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import { textSlice } from "@/shared/lib/textSlice";
import heartIcon from "@/shared/assets/icons/heart-icon.svg";

interface OfferCardProps {
    image?: string;
    title?: string;
    location?: string;
    category?: string;
    rating?: string;
    likes?: string;
    reviews?: string;
    went?: string;
    description?: string;
    link?: string;
    className?: string;
    isImageShow?: boolean;
    isFavoriteIconShow?: boolean;
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
        isFavoriteIconShow = false,
    } = props;
    const { locale } = useLocale();

    return (
        <Link to={`/${locale}/${link}` || getMainPageUrl(locale)} className={cn(styles.wrapper, className)}>
            {
                isImageShow && (
                    <div className={styles.imageWrapper}>
                        <img src={image || defaultImage} alt="offer-img" />
                        {isFavoriteIconShow
                            && <ReactSVG src={heartIcon} className={cn(styles.favorite)} />}
                    </div>
                )
            }
            <div className={styles.content}>
                <p className={styles.title}>
                    {textSlice(title, 88, "title")}
                </p>
                <div className={styles.subtitle}>
                    <span className={styles.location}>{location}</span>
                    <span className={styles.category}>{category}</span>
                </div>
                <div className={styles.stats}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                        <div className={styles.rating}>
                            <img src={star} alt="star-icon" />
                            <span>{rating}</span>
                        </div>
                        <div className={styles.likes}>
                            <img src={like} alt="heart-icon" />
                            <span>{likes}</span>
                        </div>
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
                    {textSlice(description, 110, "description")}
                </p>
            </div>
        </Link>
    );
});
