import cn from "classnames";
import React, { FC } from "react";

import { LessonsList } from "@/widgets/Academy";

import {
    Course, CourseProgressBar, ExpertsCard, TextCard,
} from "@/entities/Academy";

import styles from "./CourseContent.module.scss";
import Section from "@/shared/ui/Section/Section";

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
            <Section>
                <CourseProgressBar />
            </Section>
            <Section title="Видео" classNameWrapper={styles.courseList}>
                <LessonsList className={styles.list} />
            </Section>
        </div>
    );
};
