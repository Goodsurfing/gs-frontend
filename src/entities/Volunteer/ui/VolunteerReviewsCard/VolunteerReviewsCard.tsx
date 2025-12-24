import cn from "classnames";
import React, {
    FC, memo, useCallback, useEffect, useState,
} from "react";

import { useTranslation } from "react-i18next";
import { useLocale } from "@/app/providers/LocaleProvider";

import { ReviewWidget } from "@/widgets/ReviewWidget";

import {

    GetVolunteerReviewByVolunteerId,
} from "@/entities/Review";

import { getHostPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { ShowNext } from "@/shared/ui/ShowNext/ShowNext";
import { Text } from "@/shared/ui/Text/Text";

import { useLazyGetVolunteerReviewByVolunteerIdQuery } from "@/entities/Review/api/reviewApi";
import styles from "./VolunteerReviewsCard.module.scss";

interface VolunteerReviewsCardProps {
    volunteerId: string;
    className?: string;
}

const VISIBLE_COUNT = 1;

export const VolunteerReviewsCard: FC<VolunteerReviewsCardProps> = memo(
    (props: VolunteerReviewsCardProps) => {
        const { className, volunteerId } = props;
        const { t } = useTranslation("profile");
        const { locale } = useLocale();
        const [page, setPage] = useState<number>(1);
        const [error, setError] = useState<string | null>(null);
        const [reviews, setReviews] = useState<GetVolunteerReviewByVolunteerId[]>([]);

        const [getReviewsData,
            { data: reviewsData }] = useLazyGetVolunteerReviewByVolunteerIdQuery();

        const fetchReviews = useCallback(async (pageItem: number) => {
            try {
                const result = await getReviewsData({
                    volunteerId,
                    limit: VISIBLE_COUNT,
                    page: pageItem,
                }).unwrap();
                if (result) {
                    setReviews((prev) => {
                        if (pageItem === 1) {
                            return [...result.data];
                        }
                        return [...prev, ...result.data];
                    });
                    setError(null);
                }
            } catch {
                setError("Произошла ошибка загрузки отзывов");
            }
        }, [getReviewsData, volunteerId]);

        useEffect(() => {
            fetchReviews(page);
        }, [fetchReviews, page]);

        const renderReviews = reviews.map((review) => (
            <ReviewWidget
                name={review.name}
                avatar={getMediaContent(review.image?.thumbnails?.small)}
                reviewText={review.description}
                stars={review.rating}
                url={getHostPersonalPageUrl(locale, review.id)}
            />
        ));

        const renderContent = () => {
            if (error) {
                return <div className={styles.error}>{error}</div>;
            }
            if (reviews.length === 0) {
                return t("personal.На данный момент отзывов нет");
            }
            return renderReviews;
        };

        const handleShowNext = () => {
            setPage((prev) => prev + 1);
        };

        if (!reviewsData || reviewsData.pagination.total === 0) {
            return null;
        }

        return (
            <div id="3" className={cn(className, styles.wrapper)}>
                <Text title={t("personal.Отзывы")} titleSize="h3" />
                <div className={styles.container}>
                    {renderContent()}
                </div>
                {(reviews.length > 0) && (reviews.length < reviewsData?.pagination.total) && (
                    <ShowNext onClick={handleShowNext} />
                )}
            </div>
        );
    },
);
