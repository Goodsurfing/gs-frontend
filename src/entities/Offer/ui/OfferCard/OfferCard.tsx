import cn from "classnames";
import React, { FC, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
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
    isSelected?: boolean;
    // undefined — не знаем (ещё не проверяли/не актуально); false — точно
    // известно, что у вакансии нет координат для карты.
    hasLocation?: boolean;
    handleFavoriteClick?: (offerId: number) => void;
    onSelect?: (offerId: number) => void;
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
        isSelected = false,
        hasLocation,
        locale,
        handleFavoriteClick,
        onSelect,
    } = props;
    const { t } = useTranslation();
    const navigate = useNavigate();

    // onSelect означает, что карточка используется в контексте карты
    // (клик подсвечивает метку, а не уводит со страницы) — переход тогда
    // только по ссылке "Подробнее". Без onSelect (списки в личном
    // кабинете/профиле) клик по всей карточке должен сразу вести на
    // страницу вакансии — иначе кликабельна только крошечная ссылка
    // "Подробнее", что выглядит как сломанная карточка.
    const handleCardClick = () => {
        if (onSelect) {
            onSelect(offerId);
        } else {
            navigate(link ?? getMainPageUrl(locale));
        }
    };

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={handleCardClick}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCardClick();
                }
            }}
            className={cn(styles.wrapper, className, { [styles.selected]: isSelected })}
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
                    {hasLocation === false && (
                        <span className={styles.noLocationBadge}>{t("нет на карте")}</span>
                    )}
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
                        {!!reviews && (
                            <span className={styles.review}>
                                {t("Отзывов")}
                                :
                                {" "}
                                {reviews}
                            </span>
                        )}
                        {!!went && (
                            <span className={styles.went}>
                                {t("Отправились")}
                                :
                                {" "}
                                {went}
                            </span>
                        )}
                    </div>
                </div>
                <p className={styles.description}>
                    {textSlice(description, 110, "description")}
                </p>
                <Link
                    to={link ?? getMainPageUrl(locale)}
                    onClick={(e) => {
                        // Не даём клику дойти до onClick обёртки (двойной вызов
                        // onSelect не нужен), но сам onSelect всё равно должны
                        // вызвать явно — иначе при переходе именно по этой
                        // ссылке (а не по клику на карточку) id вакансии никогда
                        // не попадёт в URL, и "назад" вернёт к списку без выбора.
                        e.stopPropagation();
                        onSelect?.(offerId);
                    }}
                    className={styles.learnMore}
                >
                    {t("Подробнее")}
                </Link>
            </div>
        </div>
    );
});
