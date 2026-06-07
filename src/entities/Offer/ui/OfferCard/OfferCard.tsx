import cn from "classnames";
import React, { FC, memo } from "react";
import { Link } from "react-router-dom";
import { ReactSVG } from "react-svg";

import { useTranslation } from "react-i18next";
import heartIcon from "@/shared/assets/icons/heart-icon.svg";
// import like from "@/shared/assets/icons/offers/like.svg";
import star from "@/shared/assets/icons/offers/star.svg";
import { getMainPageUrl } from "@/shared/config/routes/AppUrls";
import { textSlice } from "@/shared/lib/textSlice";

import styles from "./OfferCard.module.scss";
import { Locale } from "@/entities/Locale";

interface OfferCardProps {
    offerId: number;
    image?: string;
    title?: string;
    location?: string;
    category?: string;
    rating?: number;
    // likes?: string;
    reviews?: number;
    went?: number;
    description?: string;
    link?: string;
    className?: string;
    isImageShow?: boolean;
    isFavoriteIconShow?: boolean;
    isFavorite: boolean;
    handleFavoriteClick?: (offerId: number) => void;
    locale: Locale;
}

export const OfferCard: FC<OfferCardProps> = memo((props: OfferCardProps) => {
    const {
        offerId,
        image,
        title,
        description,
        category,
        location,
        rating,
        reviews,
        went,
        link,
        className,
        isImageShow = true,
        isFavoriteIconShow = false,
        isFavorite,
        locale,
        handleFavoriteClick,
    } = props;
    const { t } = useTranslation();

    return (
        <Link
            to={link ?? getMainPageUrl(locale)}
            className={cn(styles.wrapper, className)}
        >
            {isImageShow && (
                <div className={styles.imageWrapper}>
                    {image ? <img src={image} alt="offer-img" loading="lazy" /> : <div className={styles.imagePlaceholder} />}
                    {isFavoriteIconShow && (
                        <ReactSVG
                            src={heartIcon}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleFavoriteClick?.(offerId);
                            }}
                            className={cn(styles.favorite, {
                                [styles.active]: isFavorite,
                            })}
                        />
                    )}
                </div>
            )}
            <div className={styles.content}>
                <p className={styles.title}>{textSlice(title, 50, "title")}</p>
                <div className={styles.subtitle}>
                    <span className={styles.location}>{location}</span>
                    <br />
                    <span className={styles.category}>{category}</span>
                </div>
                <div className={styles.stats}>
                    {!!rating && (
                        <div className={styles.rating}>
                            <img src={star} alt="star-icon" loading="lazy" />
                            <span>{rating}</span>
                        </div>
                    )}
                    {/* <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "0.75rem",
                        }}
                    >
                        {rating && (
                            <div className={styles.rating}>
                                <img src={star} alt="star-icon" />
                                <span>{rating}</span>
                            </div>
                        )}
                        {likes && (
                            <div className={styles.likes}>
                                <img src={like} alt="heart-icon" />
                                <span>{likes}</span>
                            </div>
                        )}
                    </div> */}
                    <div className={styles.extraInfo}>
                        <span className={styles.review}>
                            {t("Отзывов")}
                            :
                            {" "}
                            {reviews}
                        </span>
                        <span className={styles.went}>
                            {t("Отправились")}
                            :
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
