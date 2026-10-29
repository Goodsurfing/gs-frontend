"use client";

import { useState } from "react";

import { ShowNext } from "@/components/offer/ShowNext";
import { useSession } from "@/components/session/SessionProvider";
import { Avatar } from "@/components/ui/Avatar";
import { browserApi } from "@/lib/browserApi";
import { mediaUrl } from "@/lib/media";

export interface LessonReviewsLabels {
    count: string;
    loginToReview: string;
    signIn: string;
    write: string;
    placeholder: string;
    rating: string;
    empty: string;
    reviewsError: string;
    sendError: string;
    showNext: string;
    anonymous: string;
}

export interface LessonReview {
    author: { id: string; firstName?: string | null; lastName?: string | null; image?: { contentUrl?: string | null; thumbnails?: unknown } | null };
    description: string;
    rating: number;
}

// Как LESSON_REVIEWS_PAGE_SIZE в lib/academy (первая страница приходит с сервера)
const PER_PAGE = 5;

/**
 * Отзывы к уроку (LessonReview старого фронта): по пять, «Посмотреть
 * следующие»; вошедший, которому можно, ставит оценку и пишет отзыв один раз.
 */
export function LessonReviews({ lessonId, initial, canReview, signInHref, volunteerHref, labels }: {
    lessonId: string;
    /** Первая страница с сервера; null — не загрузилась */
    initial: { items: LessonReview[]; total: number } | null;
    canReview: boolean;
    signInHref: string;
    /** Адрес волонтёра с {id} */
    volunteerHref: string;
    labels: LessonReviewsLabels;
}) {
    const session = useSession();
    const [reviews, setReviews] = useState<LessonReview[]>(initial?.items ?? []);
    const [total, setTotal] = useState<number | undefined>(initial?.total);
    const [page, setPage] = useState(1);
    const [error, setError] = useState<string | null>(initial ? null : labels.reviewsError);
    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState<number | null>(null);
    const [text, setText] = useState("");
    const [sent, setSent] = useState(false);

    const load = async (target: number) => {
        setLoading(true);
        try {
            const { data } = await browserApi().GET("/api/v1/review-video-course/list/{videoCourseId}", {
                params: { path: { videoCourseId: lessonId }, query: { page: target, limit: PER_PAGE } },
            });
            if (!data) throw new Error("reviews");
            const items = (data.data ?? []).map((item) => ({ ...item, rating: Number(item.rating) })) as LessonReview[];
            setReviews((prev) => (target === 1 ? items : [...prev, ...items]));
            setTotal(data.pagination?.total ?? 0);
            setPage(target);
            setError(null);
        } catch {
            setError(labels.reviewsError);
        } finally {
            setLoading(false);
        }
    };

    const send = async () => {
        if (!canReview || !text.trim() || rating === null) return;
        try {
            const { error: apiError } = await browserApi(session.token).POST("/api/v1/review-video-course", {
                body: { videoCourseId: lessonId, description: text.trim(), rating } as never,
            });
            if (apiError) throw new Error("review");
            setSent(true);
            setText("");
            setRating(null);
            await load(1);
        } catch {
            setError(labels.sendError);
        }
    };

    const disabled = !canReview || sent;

    return (
        <div className="mb-5 flex flex-col pt-[30px] down-sm:mt-10 down-sm:pt-5">
            <span className="mb-2.5 text-[14px] font-bold">{total ?? 0} {labels.count}</span>
            {session.status === "guest" && (
                <div className="flex flex-col gap-2.5">
                    <p>{labels.loginToReview}</p>
                    <a href={signInHref} className="inline-block w-fit rounded-[10px] bg-primary px-[50px] py-3.5 text-center text-[1rem] leading-[1.375rem] text-white transition-colors duration-300 hover:bg-primary-hover">
                        {labels.signIn}
                    </a>
                </div>
            )}
            {session.status === "user" && (
                <>
                    <div role="radiogroup" aria-label={labels.rating} className="flex">
                        {[1, 2, 3, 4, 5].map((value) => (
                            <button
                                key={value}
                                type="button"
                                role="radio"
                                aria-checked={rating === value}
                                aria-label={String(value)}
                                disabled={disabled}
                                onClick={() => setRating(value)}
                                className={`cursor-pointer text-[30px] leading-none disabled:cursor-default disabled:opacity-50 ${rating !== null && value <= rating ? "text-[#FED81C]" : "text-black/26"}`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                    <div>
                        <textarea
                            aria-label={labels.placeholder}
                            value={text}
                            onChange={(event) => setText(event.target.value)}
                            placeholder={labels.placeholder}
                            disabled={disabled}
                            className="mt-2 box-border h-[7.375rem] w-full resize-none rounded-[10px] border border-[#82949F] p-3.5 text-[16px] outline-none disabled:cursor-not-allowed disabled:bg-disabled"
                        />
                        <button
                            type="button"
                            onClick={send}
                            disabled={disabled || !text.trim() || rating === null}
                            className="mt-4 cursor-pointer rounded-[10px] border border-primary px-[100px] py-3 text-[16px] leading-[120%] text-primary transition-all duration-300 hover:bg-primary hover:text-white disabled:cursor-default disabled:opacity-70 disabled:hover:bg-transparent disabled:hover:text-primary down-lg:w-full down-lg:px-[15px]"
                        >
                            {labels.write}
                        </button>
                    </div>
                </>
            )}
            <div className="mt-[30px] mb-5 flex flex-col gap-[30px] down-sm:mt-5 down-sm:mb-[15px] down-sm:gap-5">
                {error && <div>{error}</div>}
                {!error && total !== undefined && reviews.length === 0 && labels.empty}
                {!error && reviews.map((review, index) => {
                    const name = `${review.author.firstName || ""} ${review.author.lastName || ""}`.trim() || labels.anonymous;
                    const href = volunteerHref.replace("{id}", review.author.id);
                    return (
                        <div key={`${review.author.id}-${index}`} className="flex w-full flex-col gap-2">
                            <p className="text-[14px] font-medium whitespace-pre-line">{review.description}</p>
                            <div className="flex items-center">
                                <div className="flex items-center gap-1.5">
                                    {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                                    <img src="/web/icons/offer/star.svg" alt="" />
                                    <span className="text-[14px] font-bold">{review.rating}</span>
                                </div>
                                <a href={href} className="ml-3 flex" aria-hidden tabIndex={-1}>
                                    <Avatar src={mediaUrl(review.author.image, "small")} name={name} size={22} />
                                </a>
                                <a href={href} className="ml-2 text-primary">{name}</a>
                            </div>
                        </div>
                    );
                })}
            </div>
            {!error && total !== undefined && reviews.length > 0 && reviews.length < total && (
                <ShowNext onClick={() => load(page + 1)} disabled={loading} label={labels.showNext} />
            )}
        </div>
    );
}
