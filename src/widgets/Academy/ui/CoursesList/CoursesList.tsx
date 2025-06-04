import cn from "classnames";
import React, { FC } from "react";

import { CourseCard } from "@/entities/Academy";
import { mockedAcademyCourses } from "@/entities/Academy/model/mockedAcademy.data";

import styles from "./CoursesList.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";

interface CoursesListProps {
    className?: string;
}

export const CoursesList: FC<CoursesListProps> = (props) => {
    const { className } = props;
    const { locale } = useLocale();

    const renderCourses = mockedAcademyCourses.map((course) => (
        <CourseCard course={course} key={course.id} locale={locale} />
    ));

    return <div className={cn(styles.wrapper, className)}>{renderCourses}</div>;
};
