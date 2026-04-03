import cn from "classnames";
import React, { FC, useEffect } from "react";

import { CourseCard } from "@/entities/Academy";
import { useLazyGetCoursesQuery } from "@/entities/Academy/api/courseApi";

import { useLocale } from "@/app/providers/LocaleProvider";
import { AdminSort } from "@/entities/Admin";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { getFullName } from "@/shared/lib/getFullName";
import { OfferPagination } from "@/widgets/OffersMap";
import { useNewsFilters } from "@/shared/hooks/usePaginationParams";
import styles from "./CoursesList.module.scss";

interface CoursesListProps {
    className?: string;
}

const coursesLimit = 10;

export const CoursesList: FC<CoursesListProps> = (props) => {
    const { className } = props;
    const { locale } = useLocale();
    const { page, setPage } = useNewsFilters();

    const [fetchCourses, {
        data,
        isFetching,
        isLoading,
        error,
    }] = useLazyGetCoursesQuery();
    const totalPages = Math.ceil((data?.pagination?.total ?? 0) / coursesLimit);

    useEffect(() => {
        try {
            fetchCourses({ page, limit: coursesLimit, sort: AdminSort.SortDesc });
        } catch {
            // epmty
        }
    }, [fetchCourses, page]);

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
                    currentPage={page}
                    onPageChange={setPage}
                    totalPages={totalPages}
                />
            )}
        </div>
    );
};
