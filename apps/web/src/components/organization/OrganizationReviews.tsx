"use client";

import { useState } from "react";

import { ShowNext } from "@/components/offer/ShowNext";
import { Avatar } from "@/components/ui/Avatar";
import { browserApi } from "@/lib/browserApi";
import { mediaUrl } from "@/lib/media";
import type { OrganizationReview } from "@/lib/organizationLists";

const PER_PAGE = 5;

/**
 * Отзывы о вакансиях организации (HostReviewCard старого фронта): по пять,
 * «Посмотреть следующие». Ссылки на автора нет: API не отдаёт его id (старый
 * фронт подставлял id отзыва и вёл на несуществующую страницу).
 */
export function OrganizationReviews({ organizationId, initial, labels }: {
    organizationId: string;
    initial: { items: OrganizationReview[]; total: number };
    labels: { error: string; showNext: string; anonymous: string };
}) {
    const [reviews, setReviews] = useState(initial.items);
    const [page, setPage] = useState(1);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const more = async () => {
        setLoading(true);
        try {
            const { data } = await browserApi().GET("/api/v1/review-vacancy/list-by-organization/{organizationId}", {
                params: { path: { organizationId }, query: { page: page + 1, limit: PER_PAGE } },
            });
            if (!data) throw new Error("reviews");
            setReviews((prev) => [...prev, ...(data.data ?? [])]);
            setPage(page + 1);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="mt-[30px] mb-5 flex flex-col gap-[30px]">
                {error ? <div>{labels.error}</div> : reviews.map((review) => {
                    const name = `${review.firstName || ""} ${review.lastName || ""}`.trim() || labels.anonymous;
                    return (
                        <div key={review.id} className="relative flex w-full flex-col gap-2">
                            <p className="text-[14px] font-medium whitespace-pre-line">{review.description}</p>
                            <div className="flex items-center">
                                <div className="flex items-center gap-1.5">
                                    {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                                    <img src="/web/icons/offer/star.svg" alt="" />
                                    <span className="text-[14px] font-bold">{Number(review.rating) || 0}</span>
                                </div>
                                <span className="ml-3 flex"><Avatar src={mediaUrl(review.image, "small")} name={name} size={22} /></span>
                                <span className="ml-2 text-primary">{name}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
            {!error && reviews.length > 0 && reviews.length < initial.total && (
                <ShowNext onClick={more} disabled={loading} label={labels.showNext} />
            )}
        </>
    );
}
