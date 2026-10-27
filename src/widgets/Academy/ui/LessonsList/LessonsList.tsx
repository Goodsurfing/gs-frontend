import cn from "classnames";
import React, { FC, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { useLocale } from "@/app/providers/LocaleProvider";

import { LessonCard } from "@/entities/Academy";

import { useLazyGetCourseLessonsQuery } from "@/entities/Academy/api/courseApi";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { OfferPagination } from "@/widgets/OffersMap";
import { useNewsFilters } from "@/shared/hooks/usePaginationParams";
import styles from "./LessonsList.module.scss";

interface LessonsListProps {
    className?: string;
    courseId: string;
}

const LIMIT = 10;

export const LessonsList: FC<LessonsListProps> = (props) => {
    const { className, courseId } = props;
    const { locale } = useLocale();
    const { t } = useTranslation("academy");
    const { page, setPage } = useNewsFilters();

    const [fetchLessons, {
        data,
        isFetching,
        isLoading,
        error,
    }] = useLazyGetCourseLessonsQuery();
    const totalPages = Math.ceil((data?.pagination?.total ?? 0) / LIMIT);

    useEffect(() => {
        try {
            fetchLessons({ page, limit: LIMIT, courseId });
        } catch {
            // epmty
        }
    }, [fetchLessons, page, courseId]);

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
                    thumbnail: getMediaContent(image, "MEDIUM"),
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
            {(isFetching || isLoading) && <div>{t("Загрузка уроков")}</div>}
            {!isFetching && !isLoading && renderLessons.length > 0 && renderLessons}
            {!isFetching && !isLoading && renderLessons.length === 0 && (
                <div>{t("На данный момент нет ни одного урока")}</div>
            )}
            {error && <div>{t("Ошибка загрузки уроков")}</div>}
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
