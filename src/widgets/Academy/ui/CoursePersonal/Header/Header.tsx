import React, { FC } from "react";

import { GetCourse } from "@/entities/Academy";

import star from "@/shared/assets/icons/offers/star.svg";

import styles from "./Header.module.scss";
import Button from "@/shared/ui/Button/Button";
import { getFullName } from "@/shared/lib/getFullName";
import { getMediaContent } from "@/shared/lib/getMediaContent";

interface HeaderProps {
    course: GetCourse;
}

export const Header: FC<HeaderProps> = (props) => {
    const { course } = props;
    const {
        name,
        videoCount,
        duration,
        averageRating,
        author,
        image,
    } = course;

    return (
        <div className={styles.wrapper}>
            <div className={styles.content}>
                <div className={styles.info}>
                    <h1 className={styles.title}>{name}</h1>
                    <div className={styles.indicators}>
                        <span>
                            {videoCount}
                            {" "}
                            уроков
                        </span>
                        {duration !== "" && (
                            <>
                                <div className={styles.circle} />
                                <span>
                                    {duration}
                                    {" "}
                                    на прохождение
                                </span>
                            </>
                        )}
                        <div className={styles.circle} />
                        <div className={styles.rating}>
                            <img src={star} alt="star-icon" />
                            <span>{averageRating}</span>
                        </div>
                    </div>
                    <span className={styles.author}>
                        Автор:
                        {" "}
                        {getFullName(author.firsName, author.lastName)}
                    </span>
                    <Button className={styles.button} color="GREEN" size="MEDIUM" variant="FILL">Начать обучение</Button>
                </div>
                <img className={styles.cover} src={getMediaContent(image.contentUrl)} alt={name} />
            </div>
        </div>
    );
};
