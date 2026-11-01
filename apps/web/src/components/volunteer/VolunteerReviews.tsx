"use client";

import { useEffect, useState } from "react";

import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import { ShowNext } from "@/components/offer/ShowNext";
import { SectionTitle } from "@/components/offer/parts";
import { useSession } from "@/components/session/SessionProvider";
import { Avatar } from "@/components/ui/Avatar";
import { browserApi } from "@/lib/browserApi";
import { mediaUrl } from "@/lib/media";
import type { VolunteerReview } from "@/lib/volunteerLists";

const PER_PAGE = 5;

/**
 * Отзывы организаторов о волонтёре (VolunteerReviewsCard старого фронта).
 * API отдаёт их только вошедшим — гостю блока нет, как и раньше. Ссылки на
 * организацию нет: API не отдаёт её id (старый фронт подставлял id отзыва).
 */
export function VolunteerReviews({ volunteerId, labels }: {
    volunteerId: string;
    labels: { title: string; empty: string; error: string; showNext: string; gallery: { close: string; prev: string; next: string; photo: string } };
}) {
    const session = useSession();
    const [reviews, setReviews] = useState<VolunteerReview[] | null>(null);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [error, setError] = useState(false);
    const [gallery, setGallery] = useState<{ images: string[]; index: number } | null>(null);

    useEffect(() => {
        if (session.status !== "user") return;
        let cancelled = false;
        void browserApi(session.token)
            .GET("/api/v1/review-volunteer/list/{volunteerId}", { params: { path: { volunteerId }, query: { page, limit: PER_PAGE } } })
            .then(({ data }) => {
                if (cancelled || !data) return;
                setReviews((prev) => (page === 1 ? data.data ?? [] : [...(prev ?? []), ...(data.data ?? [])]));
                setTotal(data.pagination?.total ?? 0);
                setError(false);
            })
            .catch(() => !cancelled && setError(true));
        return () => {
            cancelled = true;
        };
    }, [session.status, session.token, volunteerId, page]);

    if (reviews === null && !error) return null;
    const list = reviews ?? [];
    return (
        <div id="3" className="mt-10">
            <SectionTitle>{labels.title}</SectionTitle>
            <div className="mt-[30px] mb-5 flex flex-col gap-[30px]">
                {error && <div>{labels.error}</div>}
                {!error && list.length === 0 && labels.empty}
                {!error && list.map((review) => {
                    const images = (review.images ?? []).map((image) => mediaUrl(image, "large")).filter((url): url is string => !!url);
                    return (
                        <div key={review.id} className="relative flex w-full flex-col gap-2">
                            <p className="text-[14px] font-medium whitespace-pre-line">{(review as { description?: string }).description}</p>
                            {images.length > 0 && (
                                <div className="mt-1.5 flex flex-wrap gap-1.5">
                                    {(review.images ?? []).slice(0, 4).map((image, index) => (
                                        <button key={image.id} type="button" onClick={() => setGallery({ images, index })} className="relative h-14 w-14 shrink-0 cursor-pointer overflow-hidden rounded-[6px]">
                                            {/* eslint-disable-next-line @next/next/no-img-element -- превью из хранилища */}
                                            <img src={mediaUrl(image, "small")} alt="" className="block h-full w-full object-cover" />
                                            {index === 3 && images.length > 4 && (
                                                <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-[14px] font-semibold text-white">{`+${images.length - 4}`}</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                            <div className="flex items-center">
                                <div className="flex items-center gap-1.5">
                                    {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                                    <img src="/web/icons/offer/star.svg" alt="" />
                                    <span className="text-[14px] font-bold">{Number(review.rating) || 0}</span>
                                </div>
                                <span className="ml-3 flex"><Avatar src={mediaUrl(review.image, "small")} name={review.name} size={22} /></span>
                                <span className="ml-2 text-primary">{review.name}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
            {!error && list.length > 0 && list.length < total && (
                <ShowNext onClick={() => setPage(page + 1)} label={labels.showNext} />
            )}
            <GalleryLightbox images={gallery?.images ?? []} index={gallery?.index ?? null} onClose={() => setGallery(null)} labels={labels.gallery} />
        </div>
    );
}
