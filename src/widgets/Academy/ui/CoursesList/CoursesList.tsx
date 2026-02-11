import cn from "classnames";
import React, { FC, useEffect, useState } from "react";

import { CourseCard } from "@/entities/Academy";
import { useLazyGetCoursesQuery } from "@/entities/Academy/api/courseApi";

import styles from "./CoursesList.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";
import { AdminSort } from "@/entities/Admin";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { getFullName } from "@/shared/lib/getFullName";
import { OfferPagination } from "@/widgets/OffersMap";

interface CoursesListProps {
    className?: string;
}

export const CoursesList: FC<CoursesListProps> = (props) => {
    const { className } = props;
    const { locale } = useLocale();
    const [currentPage, setCurrentPage] = useState(1);
    const coursesLimit = 10;

    const [fetchCourses, {
        data,
        isFetching,
        isLoading,
        error,
    }] = useLazyGetCoursesQuery();
    const totalPages = Math.ceil((data?.pagination?.total ?? 0) / coursesLimit);

    useEffect(() => {
        try {
            fetchCourses({ page: currentPage, limit: coursesLimit, sort: AdminSort.CreatedDesc });
        } catch {
            // epmty
        }
    }, [fetchCourses, currentPage, coursesLimit]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

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
                    author: getFullName(author.firsName, author.lastName),
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
            {!isFetching && !isLoading && renderCourses.length > 0 && renderCourses}
            {!isFetching && !isLoading && renderCourses.length === 0 && (
                <div>На данный момент нет ни одного курса</div>
            )}
            {error && <div>Ошибка загрузки курсов</div>}
            {!isFetching && !isLoading && totalPages > 1 && (
                <OfferPagination
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    totalPages={totalPages}
                />
            )}
        </div>
    );
};
