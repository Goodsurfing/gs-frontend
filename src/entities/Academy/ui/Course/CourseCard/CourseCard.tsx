import cn from "classnames";
import React, { FC } from "react";
import { Link } from "react-router-dom";

import { Locale } from "@/entities/Locale";

import star from "@/shared/assets/icons/offers/star.svg";
import defaultImage from "@/shared/assets/images/default-offer-image.png";
import { getAcademyCoursePageUrl } from "@/shared/config/routes/AppUrls";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";

import styles from "./CourseCard.module.scss";

interface CourseCardProps {
    course: {
        id: string;
        title: string;
        description: string;
        author: string;
        duration: string;
        numberLessons: number;
        rating: number;
        cover?: string;
    };
    className?: string;
    locale: Locale;
}

export const CourseCard: FC<CourseCardProps> = (props) => {
    const { course, className, locale } = props;
    const {
        id,
        title,
        description,
        author,
        duration,
        numberLessons,
        rating,
        cover,
    } = course;

    const coverImg = cover || defaultImage;

    return (
        <Link
            to={getAcademyCoursePageUrl(locale, id.toString())}
            className={cn(styles.wrapper, className)}
        >
            <img className={styles.cover} src={coverImg} alt={title} />
            <div className={styles.content}>
                <div className={styles.info}>
                    <h3 className={styles.title}>
                        Волонтерский лагерь «онлайн»: как вести видео блог и
                        управлять соцсетями
                    </h3>
                    <div className={styles.indicators}>
                        <div className={styles.gray}>
                            {numberLessons}
                            {" "}
                            видео
                        </div>
                        <div className={styles.gray}>•</div>
                        <div className={styles.gray}>{duration}</div>
                        <div className={styles.gray}>•</div>
                        <div className={styles.rating}>
                            <img src={star} alt="star-icon" />
                            <span>{rating}</span>
                        </div>
                    </div>
                    <span className={styles.gray}>
                        Автор:
                        {author}
                    </span>
                    <p className={styles.description}>{description}</p>
                </div>
                <ButtonLink
                    className={styles.button}
                    type="primary"
                    path={getAcademyCoursePageUrl(locale, id.toString())}
                >
                    Пройти курс
                </ButtonLink>
            </div>
        </Link>
    );
};
