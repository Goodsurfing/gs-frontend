import cn from "classnames";
import React, { FC } from "react";
import { useNavigate } from "react-router-dom";

import { Course } from "@/entities/Academy/model/types/academy";
import { Locale } from "@/entities/Locale";

import star from "@/shared/assets/icons/offers/star.svg";
import defaultImage from "@/shared/assets/images/default-offer-image.svg";
import { getAcademyCoursePageUrl } from "@/shared/config/routes/AppUrls";
import Button from "@/shared/ui/Button/Button";

import styles from "./CourseCard.module.scss";

interface CourseCardProps {
    course: Course;
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
    const navigate = useNavigate();
    const coverImg = cover || defaultImage;

    const onNavigate = () => {
        navigate(getAcademyCoursePageUrl(locale, id.toString()));
    };

    return (
        <div className={cn(styles.wrapper, className)} onClick={onNavigate}>
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
                <Button
                    className={styles.button}
                    color="BLUE"
                    size="SMALL"
                    variant="FILL"
                    onClick={onNavigate}
                >
                    Пройти курс
                </Button>
            </div>
        </div>
    );
};
