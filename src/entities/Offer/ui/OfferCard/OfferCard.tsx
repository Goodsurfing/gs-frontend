import cn from "classnames";
import React, { FC, memo } from "react";
import { Link } from "react-router-dom";
import { ReactSVG } from "react-svg";

import { useTranslation } from "react-i18next";
import heartIcon from "@/shared/assets/icons/heart-icon.svg";
import star from "@/shared/assets/icons/offers/star.svg";
import { getMainPageUrl } from "@/shared/config/routes/AppUrls";
import { formatDuration } from "@/shared/lib/formatDuration";

import styles from "./OfferCard.module.scss";
import { Locale } from "@/entities/Locale";

const BADGE_LABELS: Record<string, string> = {
    new: "Новое",
    popular: "Популярное",
    urgent: "Срочно",
};

interface OfferCardProps {
    offerId: number;
    image?: string;
    title?: string;
    location?: string;
    category?: string;
    categoryColor?: string;
    tags?: string[];
    rating?: number;
    reviews?: number;
    went?: number;
    description?: string;
    durationMinDays?: number;
    durationMaxDays?: number;
    badge?: "new" | "popular" | "urgent" | null;
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
        categoryColor,
        tags,
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
        durationMinDays,
        durationMaxDays,
        badge,
    } = props;
    const { t } = useTranslation();

    const duration = formatDuration(durationMinDays, durationMaxDays);

    if (!isImageShow) {
        return (
            <Link
                to={link ?? getMainPageUrl(locale)}
                className={cn(styles.compactWrapper, className)}
            >
                <div className={styles.content}>
                    <p className={styles.title}>{title}</p>
                    <div className={styles.subtitle}>
                        <span className={styles.location}>{location}</span>
                        {category && <span className={styles.category}>{category}</span>}
                    </div>
                    <div className={styles.stats}>
                        {!!rating && (
                            <div className={styles.rating}>
                                <img src={star} alt="star-icon" loading="lazy" />
                                <span>{rating}</span>
                            </div>
                        )}
                        <div className={styles.extraInfo}>
                            {reviews != null && (
                                <span className={styles.review}>
                                    {t("Отзывов")}
                                    {": "}
                                    {reviews}
                                </span>
                            )}
                            {went != null && (
                                <span className={styles.went}>
                                    {t("Отправились")}
                                    {": "}
                                    {went}
                                </span>
                            )}
                        </div>
                    </div>
                    {description && (
                        <p className={styles.description}>{description}</p>
                    )}
                </div>
            </Link>
        );
    }

    return (
        <Link
            to={link ?? getMainPageUrl(locale)}
            className={cn(styles.wrapper, className)}
        >
            <div className={styles.imageWrapper}>
                {image
                    ? <img src={image} alt="offer-img" loading="lazy" />
                    : (
                        <div
                            className={styles.imagePlaceholder}
                            style={categoryColor ? { background: `linear-gradient(135deg, ${categoryColor}cc, ${categoryColor})` } : undefined}
                        />
                    )}
                {badge && (
                    <span className={cn(styles.badge, styles[`badge_${badge}`])}>
                        {BADGE_LABELS[badge]}
                    </span>
                )}
                {isFavoriteIconShow && (
                    <button
                        type="button"
                        className={cn(styles.favBtn, { [styles.favBtnActive]: isFavorite })}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleFavoriteClick?.(offerId);
                        }}
                        aria-label="В избранное"
                    >
                        <ReactSVG src={heartIcon} />
                    </button>
                )}
            </div>

            <div className={styles.content}>
                {category && (
                    <div
                        className={styles.kicker}
                        style={categoryColor ? { color: categoryColor } : undefined}
                    >
                        {category}
                    </div>
                )}
                <p className={styles.title}>{title}</p>
                {(location || duration) && (
                    <div className={styles.meta}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className={styles.pinIcon}>
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        {location && <span>{location}</span>}
                        {duration && (
                            <>
                                <span className={styles.dot} />
                                <span>{duration}</span>
                            </>
                        )}
                    </div>
                )}
                <div className={styles.bottom}>
                    {tags && tags.length > 0 && (
                        <div className={styles.tags}>
                            {tags.slice(0, 3).map((tag) => (
                                <span key={tag} className={styles.tag}>{tag}</span>
                            ))}
                        </div>
                    )}
                    {!!rating && (
                        <div className={styles.ratingRow}>
                            <span className={styles.starIcon}>★</span>
                            <b>{rating}</b>
                            {reviews != null && reviews > 0 && (
                                <span className={styles.reviewCount}>
                                    {reviews}
                                    {" "}
                                    отз.
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
});
