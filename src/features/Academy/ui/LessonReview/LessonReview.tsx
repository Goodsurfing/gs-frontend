import React, {
    ChangeEventHandler, FC, useCallback, useEffect, useState,
} from "react";
import { Rating } from "@mui/material";
import { CommentInput } from "@/features/Article";
import { useGetFullName } from "@/shared/lib/getFullName";
import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";
import { GetReviewsLesson, useCreateReviewLessonMutation, useLazyGetReviewsLessonQuery } from "@/entities/Academy";
import { ReviewWidget } from "@/widgets/ReviewWidget";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { getVolunteerPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { ShowNext } from "@/shared/ui/ShowNext/ShowNext";
import styles from "./LessonReview.module.scss";

interface LessonReviewProps {
    lessonId: string;
    locale: Locale;
}

const REVIEWS_LIMIT = 5;

export const LessonReview: FC<LessonReviewProps> = (props) => {
    const { lessonId, locale } = props;

    const [isSendReview, setSendReview] = useState(false);
    const [rating, setRating] = useState<number | null>(null);
    const [commentInput, setCommentInput] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [error, setError] = useState<string | null>(null);
    const [reviews, setReviews] = useState<GetReviewsLesson[]>([]);
    const { getFullName } = useGetFullName();

    const [getReviewsData, { data: reviewsData }] = useLazyGetReviewsLessonQuery();
    const [createLessonReview] = useCreateReviewLessonMutation();

    const fetchReviews = useCallback(async (pageItem: number) => {
        try {
            await getReviewsData({
                videoCourseId: lessonId,
                limit: REVIEWS_LIMIT,
                page: pageItem,
            }).unwrap();
            setError(null);
        } catch {
            setError("Произошла ошибка загрузки отзывов");
        }
    }, [getReviewsData, lessonId]);

    useEffect(() => {
        fetchReviews(page);
    }, [fetchReviews, page]);

    useEffect(() => {
        if (reviewsData?.data) {
            setReviews((prev) => {
                if (page === 1) {
                    return [...reviewsData.data];
                }
                return [...prev, ...reviewsData.data];
            });
        }
    }, [reviewsData, page]);

    const handleSendReview = useCallback(async () => {
        if (!commentInput.trim() || rating === null) return;

        try {
            await createLessonReview({
                videoCourseId: lessonId,
                description: commentInput.trim(),
                rating,
            }).unwrap();

            setSendReview(true);
            setCommentInput("");
            setRating(null);

            setPage(1);
            await fetchReviews(1);
        } catch (err) {
            setError("Не удалось отправить отзыв. Попробуйте позже.");
        }
    }, [commentInput, rating, createLessonReview, lessonId, fetchReviews]);

    const renderReviews = reviews.map((review, index) => (
        <ReviewWidget
            name={getFullName(review.author.firstName, review.author.lastName)}
            avatar={getMediaContent(review.author.image?.thumbnails?.small)}
            reviewText={review.description}
            stars={review.rating}
            url={getVolunteerPersonalPageUrl(locale, review.author.id)}
            key={index}
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

    return (
        <div className={styles.wrapper}>
            <span className={styles.commentsCount}>
                {reviewsData?.pagination.total ?? 0}
                {" "}
                комментариев
            </span>
            <Rating
                disabled={isSendReview}
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
                btnText="Написать отзыв"
                disabled={isSendReview}
                disabledBtn={!commentInput.trim() || rating === null}
                placeholder="Ваш отзыв"
                className={styles.commentInput}
                value={commentInput}
                onChange={handleCommentInput}
            />
            <div className={styles.container}>
                {renderContent()}
            </div>
            {(reviews.length > 0) && (reviewsData?.pagination?.total !== undefined)
            && (reviews.length < reviewsData.pagination.total) && (
                <ShowNext onClick={handleShowNext} />
            )}
        </div>
    );
};
