import cn from "classnames";
import React, { FC } from "react";

import { useLocale } from "@/app/providers/LocaleProvider";

import { LessonCard } from "@/entities/Academy";
import { mockedAcademyLessons } from "@/entities/Academy/model/mockedAcademy.data";

import styles from "./LessonsList.module.scss";

interface LessonsListProps {
    className?: string;
}

export const LessonsList: FC<LessonsListProps> = (props) => {
    const { className } = props;
    const { locale } = useLocale();

    const renderLessons = mockedAcademyLessons.map((lesson) => (
        <LessonCard lesson={lesson} key={lesson.id} locale={locale} />
    ));

    return <div className={cn(styles.wrapper, className)}>{renderLessons}</div>;
};
