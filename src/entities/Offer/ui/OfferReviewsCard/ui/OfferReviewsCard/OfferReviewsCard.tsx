import React, {
    ChangeEventHandler,
    FC, memo, useCallback, useEffect, useState,
} from "react";
import { useTranslation } from "react-i18next";

import { Rating } from "@mui/material";
import { useLocale } from "@/app/providers/LocaleProvider";

import { ReviewWidget } from "@/widgets/ReviewWidget";

import {
    GetOfferReviewByVacancy, useCreateOfferReviewMutation, useLazyGetOfferReviewByVacancyIdQuery,
} from "@/entities/Review";

import { getVolunteerPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { useGetFullName } from "@/shared/lib/getFullName";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { ShowNext } from "@/shared/ui/ShowNext/ShowNext";
import { Text } from "@/shared/ui/Text/Text";

import { CommentInput } from "@/features/Article";
import styles from "./OfferReviewsCard.module.scss";

interface OfferReviewsCardProps {
    offerId: number;
    canReview: boolean;
}

const VISIBLE_COUNT = 5;

export const OfferReviewsCard: FC<OfferReviewsCardProps> = memo(
    (props: OfferReviewsCardProps) => {
        const { offerId, canReview } = props;
        const { t } = useTranslation("offer");
        const [isSendReview, setSendReview] = useState(false);
        const [rating, setRating] = useState<number | null>(null);
        const [commentInput, setCommentInput] = useState<string>("");
        const [page, setPage] = useState<number>(1);
        const [error, setError] = useState<string | null>(null);
        const [reviews, setReviews] = useState<GetOfferReviewByVacancy[]>([]);
        const [shouldRefetch, setShouldRefetch] = useState(false);
        const { locale } = useLocale();
        const { getFullName } = useGetFullName();

        const [getReviewsData, { data: reviewsData }] = useLazyGetOfferReviewByVacancyIdQuery();
        const [createOfferReview] = useCreateOfferReviewMutation();

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

        useEffect(() => {
            if (shouldRefetch) {
                fetchReviews(1);
                setPage(1);
                setShouldRefetch(false);
            }
        }, [shouldRefetch, fetchReviews]);

        const handleSendReview = useCallback(async () => {
            if (!canReview || !commentInput.trim() || rating === null) return;

            try {
                await createOfferReview({
                    vacancyId: offerId,
                    description: commentInput.trim(),
                    rating,
                }).unwrap();

                setSendReview(true);
                setCommentInput("");
                setRating(null);

                setShouldRefetch(true);
            } catch (err) {
                setError("Не удалось отправить отзыв. Попробуйте позже.");
            }
        }, [canReview, commentInput, rating, createOfferReview, offerId]);

        const renderReviews = reviews.map((review) => (
            <ReviewWidget
                name={getFullName(review.author.firstName, review.author.lastName)}
                avatar={getMediaContent(review.author.image?.thumbnails?.small)}
                reviewText={review.description}
                stars={review.rating}
                url={getVolunteerPersonalPageUrl(locale, review.author.id)}
                key={review.id}
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

        if (!reviewsData) {
            return null;
        }

        return (
            <div className={styles.wrapper} id="review">
                <Text title={t("personalOffer.Отзывы")} titleSize="h3" />
                <Rating
                    disabled={!canReview || isSendReview}
                    size="large"
                    value={rating}
                    onChange={(_, valueItem) => setRating(valueItem)}
                    sx={{
                        "& .MuiRating-iconFilled": {
                            color: "#FED81C",
                        },
                    }}
                />
                <CommentInput
                    onSend={handleSendReview}
                    btnText={t("personalOffer.Написать отзыв")}
                    disabled={!canReview || isSendReview}
                    disabledBtn={!commentInput.trim() || rating === null}
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
