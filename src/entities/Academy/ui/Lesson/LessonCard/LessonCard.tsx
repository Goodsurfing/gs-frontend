import React, { FC } from "react";
import styles from "./LessonCard.module.scss";
import { Lesson } from "@/entities/Academy/model/types/academy";

interface LessonCardProps {
    lesson: Lesson
}

export const LessonCard: FC<LessonCardProps> = (props) => {
    const { lesson } = props;
    return (
        <div className={styles.wrapper}>LessonCard</div>
    );
};
