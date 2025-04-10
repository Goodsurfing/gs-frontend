import cn from "classnames";
import React, { FC } from "react";

import {
    Course, ExpertsCard, TextCard,
} from "@/entities/Academy";

import styles from "./CourseContent.module.scss";

interface CourseContentProps {
    className?: string;
    course: Course;
}

export const CourseContent: FC<CourseContentProps> = (props) => {
    const { course, className } = props;
    const {
        description, aboutAuthor, forWho, experts,
    } = course;

    return (
        <div className={cn(styles.wrapper, className)}>
            <TextCard title="О курсе" text={description} />
            <TextCard title="Об авторе" text={aboutAuthor} />
            <TextCard title="Для кого подходит курс" text={forWho} />
            <ExpertsCard experts={experts} />
        </div>
    );
};
