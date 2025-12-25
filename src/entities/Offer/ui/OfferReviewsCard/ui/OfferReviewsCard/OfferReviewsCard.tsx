import React, {
    ChangeEventHandler,
    FC, memo, useCallback, useEffect, useState,
} from "react";
import { useTranslation } from "react-i18next";

import { useLocale } from "@/app/providers/LocaleProvider";

import { ReviewWidget } from "@/widgets/ReviewWidget";

import {
    GetOfferReviewByVacancy, useLazyGetOfferReviewByVacancyIdQuery,
} from "@/entities/Review";

import { getVolunteerPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { useGetFullName } from "@/shared/lib/getFullName";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { ShowNext } from "@/shared/ui/ShowNext/ShowNext";
import { Text } from "@/shared/ui/Text/Text";

import styles from "./OfferReviewsCard.module.scss";
import { CommentInput } from "@/features/Article";

interface OfferReviewsCardProps {
    offerId: number;
}

const VISIBLE_COUNT = 1;

export const OfferReviewsCard: FC<OfferReviewsCardProps> = memo(
    (props: OfferReviewsCardProps) => {
        const { offerId } = props;
        const { t } = useTranslation("offer");
        const [page, setPage] = useState<number>(1);
        const [error, setError] = useState<string | null>(null);
        const [commentInput, setCommentInput] = useState<string>("");
        const [reviews, setReviews] = useState<GetOfferReviewByVacancy[]>([]);
        const { locale } = useLocale();
        const { getFullName } = useGetFullName();

        const [getReviewsData, { data: reviewsData }] = useLazyGetOfferReviewByVacancyIdQuery();

        const fetchReviews = useCallback(async (pageItem: number) => {
            try {
                const result = await getReviewsData({
                    vacancyId: offerId,
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
        }, [getReviewsData, offerId]);

        useEffect(() => {
            fetchReviews(page);
        }, [fetchReviews, page]);

        const renderReviews = reviews.map((review) => (
            <ReviewWidget
                name={getFullName(review.author.firstName, review.author.lastName)}
                avatar={getMediaContent(review.author.image?.thumbnails?.small)}
                reviewText={review.description}
                stars={review.rating}
                url={getVolunteerPersonalPageUrl(locale, review.author.id)}
            />
        ));

        const renderContent = () => {
            if (error) {
                return <div className={styles.error}>{error}</div>;
            }
            if (reviews.length === 0) {
                return "На данный момент отзывов нет";
            }
            return renderReviews;
        };

        const handleShowNext = () => {
            setPage((prev) => prev + 1);
        };

        const handleCommentInput: ChangeEventHandler<HTMLTextAreaElement> = useCallback(
            (event) => {
                setCommentInput(event.currentTarget.value);
            },
            [setCommentInput],
        );

        if (!reviewsData || reviewsData.pagination.total === 0) {
            return null;
        }

        return (
            <div className={styles.wrapper} id="review">
                <Text title={t("personalOffer.Отзывы")} titleSize="h3" />
                <CommentInput
                    btnText={t("personalOffer.Написать отзыв")}
                    placeholder={t("personalOffer.Ваш отзыв")}
                    className={styles.commentInput}
                    value={commentInput}
                    onChange={handleCommentInput}
                />
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
