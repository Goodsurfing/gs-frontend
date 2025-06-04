import React, { FC } from "react";

import { Course } from "@/entities/Academy";

import star from "@/shared/assets/icons/offers/star.svg";

import styles from "./Header.module.scss";
import Button from "@/shared/ui/Button/Button";

interface HeaderProps {
    course: Course;
}

export const Header: FC<HeaderProps> = (props) => {
    const { course } = props;
    const {
        title,
        author,
        duration,
        numberLessons,
        rating,
        cover,
    } = course;

    return (
        <div className={styles.wrapper}>
            <div className={styles.content}>
                <div className={styles.info}>
                    <h1 className={styles.title}>{title}</h1>
                    <div className={styles.indicators}>
                        <span>
                            {numberLessons}
                            {" "}
                            уроков
                        </span>
                        <div className={styles.circle} />
                        <span>
                            {duration}
                            {" "}
                            на прохождение
                        </span>
                        <div className={styles.circle} />
                        <div className={styles.rating}>
                            <img src={star} alt="star-icon" />
                            <span>{rating}</span>
                        </div>
                    </div>
                    <span className={styles.author}>
                        Автор:
                        {" "}
                        {author}
                    </span>
                    <Button className={styles.button} color="GREEN" size="MEDIUM" variant="FILL">Начать обучение</Button>
                </div>
                <img className={styles.cover} src={cover} alt={title} />
            </div>
        </div>
    );
};
