import cn from "classnames";
import React, { FC, useEffect, useState } from "react";

import { useLocale } from "@/app/providers/LocaleProvider";

import { LessonCard } from "@/entities/Academy";

import { useLazyGetCourseLessonsQuery } from "@/entities/Academy/api/courseApi";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { OfferPagination } from "@/widgets/OffersMap";
import styles from "./LessonsList.module.scss";

interface LessonsListProps {
    className?: string;
    courseId: string;
}

const LIMIT = 10;

export const LessonsList: FC<LessonsListProps> = (props) => {
    const { className, courseId } = props;
    const { locale } = useLocale();
    const [currentPage, setCurrentPage] = useState(1);

    const [fetchLessons, {
        data,
        isFetching,
        isLoading,
        error,
    }] = useLazyGetCourseLessonsQuery();
    const totalPages = Math.ceil((data?.pagination?.total ?? 0) / LIMIT);

    useEffect(() => {
        try {
            fetchLessons({ page: currentPage, limit: LIMIT, courseId });
        } catch {
            // epmty
        }
    }, [fetchLessons, currentPage, courseId]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const renderLessons = data ? data?.data.map((lesson) => {
        const {
            id, name, description, duration, averageRating, image,
        } = lesson;
        return (
            <LessonCard
                lesson={{
                    title: name,
                    description,
                    duration,
                    thumbnail: getMediaContent(image.contentUrl),
                    id,
                    rating: averageRating,
                }}
                key={lesson.id}
                locale={locale}
            />
        );
    }) : [];

    return (
        <div className={cn(styles.wrapper, className)}>
            {(isFetching || isLoading) && <div>Загрузка уроков...</div>}
            {!isFetching && !isLoading && renderLessons.length > 0 && renderLessons}
            {!isFetching && !isLoading && renderLessons.length === 0 && (
                <div>На данный момент нет ни одного урока</div>
            )}
            {error && <div>Ошибка загрузки уроков</div>}
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
