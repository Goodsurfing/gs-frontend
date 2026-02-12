import cn from "classnames";
import React, { FC } from "react";
import { Link } from "react-router-dom";
import { Locale } from "@/entities/Locale";

import star from "@/shared/assets/icons/offers/star.svg";
import { getAcademyLessonPageUrl } from "@/shared/config/routes/AppUrls";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";

import styles from "./LessonCard.module.scss";

interface LessonCardProps {
    lesson: {
        title: string;
        description: string;
        duration: string;
        thumbnail?: string;
        id: string;
        rating: number,
    };
    locale: Locale;
    className?: string;
}

export const LessonCard: FC<LessonCardProps> = (props) => {
    const { lesson, locale, className } = props;
    const {
        title, description, duration, thumbnail, id, rating,
    } = lesson;

    return (
        <Link
            to={getAcademyLessonPageUrl(locale, id.toString())}
            className={cn(styles.wrapper, className)}
        >
            {thumbnail
                ? (
                    <img
                        className={styles.cover}
                        src={thumbnail}
                        alt={title}
                    />
                ) : <div className={styles.emptyCover} />}
            <div className={styles.content}>
                <div className={styles.info}>
                    <h3 className={styles.title}>
                        {title}
                    </h3>
                    <div className={styles.indicators}>
                        <div className={styles.gray}>{duration}</div>
                        <div className={styles.rating}>
                            <img src={star} alt="star-icon" />
                            <span>{rating}</span>
                        </div>
                    </div>
                    <p className={styles.description}>{description}</p>
                </div>
                <ButtonLink
                    type="primary"
                    className={styles.button}
                    path={getAcademyLessonPageUrl(locale, id.toString())}
                >
                    Смотреть лекцию
                </ButtonLink>
            </div>
        </Link>
    );
};
