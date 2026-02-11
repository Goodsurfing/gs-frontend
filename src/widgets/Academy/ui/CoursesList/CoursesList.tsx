import cn from "classnames";
import React, { FC, useEffect } from "react";

import { CourseCard } from "@/entities/Academy";
import { useLazyGetCoursesQuery } from "@/entities/Academy/api/courseApi";

import styles from "./CoursesList.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";
import { AdminSort } from "@/entities/Admin";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { getFullName } from "@/shared/lib/getFullName";

interface CoursesListProps {
    className?: string;
}

export const CoursesList: FC<CoursesListProps> = (props) => {
    const { className } = props;
    const { locale } = useLocale();

    const [fetchCourses, {
        data,
        isFetching,
        isLoading,
        error,
    }] = useLazyGetCoursesQuery();

    useEffect(() => {
        // load first page
        try {
            fetchCourses({ page: 1, limit: 20, sort: AdminSort.CreatedDesc });
        } catch (e) {
            // ignore
        }
    }, [fetchCourses]);

    const renderCourses = data ? data.data.map((course) => {
        const {
            id, name, image, author, averageRating, description,
            duration, videoCount,
        } = course;
        return (
            <CourseCard
                course={{
                    id,
                    title: name,
                    cover: getMediaContent(image.contentUrl),
                    author: getFullName(author.firstName, author.lastName),
                    description,
                    duration,
                    numberLessons: videoCount,
                    rating: averageRating,
                }}
                key={course.id}
                locale={locale}
            />
        );
    }) : [];

    return (
        <div className={cn(styles.wrapper, className)}>
            {(isFetching || isLoading) && <div>Загрузка курсов...</div>}
            {!isFetching && !isLoading && renderCourses}
            {error && <div>Ошибка загрузки курсов</div>}
        </div>
    );
};
