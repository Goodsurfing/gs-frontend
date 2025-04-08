import React, { FC } from "react";
import styles from "./LessonsList.module.scss";
import { Lesson } from "@/entities/Academy";

interface LessonsListProps {
    lessons: Lesson[]
}

export const LessonsList: FC<LessonsListProps> = (props) => {
    const { lessons } = props;
    return (
        <div className={styles.wrapper}>LessonsList</div>
    );
};
