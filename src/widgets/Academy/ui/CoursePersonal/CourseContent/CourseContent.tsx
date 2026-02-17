import cn from "classnames";
import React, { FC } from "react";

import {
    CourseProgressBar, ExpertsCard, GetCourse, TextCard,
} from "@/entities/Academy";

import styles from "./CourseContent.module.scss";
import Section from "@/shared/ui/Section/Section";
import { LessonsList } from "../../LessonsList/LessonsList";

interface CourseContentProps {
    className?: string;
    course: GetCourse;
    courseId: string;
}

export const CourseContent: FC<CourseContentProps> = (props) => {
    const { course, className, courseId } = props;
    const {
        description, aboutAuthor, courseFor, experts,
    } = course;

    return (
        <div className={cn(styles.wrapper, className)}>
            {description !== "" && (
                <TextCard title="О курсе" text={description} />
            )}
            {aboutAuthor !== "" && (
                <TextCard title="Об авторе" text={aboutAuthor} />
            )}
            {courseFor !== "" && (
                <TextCard title="Для кого подходит курс" text={courseFor} />
            )}
            {experts.length !== 0 && (
                <ExpertsCard experts={experts} />
            )}
            {course.videoCount !== 0 && (
                <Section>
                    <CourseProgressBar
                        totalLessons={course.videoCount}
                        finishedLessons={course.courseProgressNumber.length}
                    />
                </Section>
            )}
            <Section title="Видео" classNameWrapper={styles.courseList} id="lessons">
                <LessonsList className={styles.list} courseId={courseId} />
            </Section>
        </div>
    );
};
