"use client";

import { useRef, useState } from "react";

import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import { Avatar } from "@/components/ui/Avatar";
import { API_URL, browserApi } from "@/lib/browserApi";
import { mediaUrl } from "@/lib/media";
import { type OfferReview, type Page, toReviewClient } from "@/lib/offerReview";

import { personName } from "./OfferParticipants";
import { useOfferViewer } from "./OfferViewer";
import { ShowNext } from "./ShowNext";
import { SectionTitle } from "./parts";

export interface ReviewsLabels {
    title: string;
    empty: string;
    loadError: string;
    sendError: string;
    deleteError: string;
    deleteConfirm: string;
    delete: string;
    showNext: string;
    anonymous: string;
    write: string;
    placeholder: string;
    rating: string;
    addPhoto: string;
    removePhoto: string;
    tooMany: string;
    gallery: { close: string; prev: string; next: string; photo: string };
}

const PER_PAGE = 5;
// Как DeleteHandler::DELETE_WINDOW на бэкенде (GS-132): свой отзыв можно удалить в течение суток
const DELETE_WINDOW_MS = 24 * 60 * 60 * 1000;
const MAX_PHOTOS = 10;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

interface Uploaded { id: string; url: string }

/**
 * «Отзывы» (OfferReviewsCard старого фронта): первые пять — с сервера,
 * дальше по пять. Кто может оставить отзыв (участник) — оценка, текст и до
 * десяти фото; свой отзыв можно удалить в течение суток.
 */
export function OfferReviews({ offerId, initial, volunteerHref, labels }: {
    offerId: number;
    initial: Page<OfferReview> | null;
    volunteerHref: string;
    labels: ReviewsLabels;
}) {
    const viewer = useOfferViewer();
    const [reviews, setReviews] = useState(initial?.items ?? []);
    const [total, setTotal] = useState(initial?.total);
    const [page, setPage] = useState(1);
    const [error, setError] = useState<string | null>(initial === null ? labels.loadError : null);
    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState<number | null>(null);
    const [text, setText] = useState("");
    const [photos, setPhotos] = useState<Uploaded[]>([]);
    const [uploading, setUploading] = useState(0);
    const [sent, setSent] = useState(false);
    const [gallery, setGallery] = useState<{ images: string[]; index: number } | null>(null);
    const fileInput = useRef<HTMLInputElement>(null);
    // Момент открытия страницы — для окна удаления своего отзыва
    const [now] = useState(() => Date.now());

    const api = () => browserApi(viewer.token);

    const load = async (target: number) => {
        setLoading(true);
        try {
            const { data } = await api().GET("/api/v1/review-vacancy/list/{vacancyId}", {
                params: { path: { vacancyId: offerId }, query: { page: target, limit: PER_PAGE } },
            });
            if (!data) throw new Error("reviews");
            const items = (data.data ?? []).map(toReviewClient);
            setReviews((prev) => (target === 1 ? items : [...prev, ...items]));
            setTotal(data.pagination?.total ?? 0);
            setPage(target);
            setError(null);
        } catch {
            setError(labels.loadError);
        } finally {
            setLoading(false);
        }
    };

    const upload = async (files: FileList | null) => {
        if (!files) return;
        const slots = MAX_PHOTOS - photos.length;
        if (slots <= 0) {
            setError(labels.tooMany);
            return;
        }
        const chosen = Array.from(files).filter((file) => file.type.startsWith("image/") && file.size <= MAX_PHOTO_BYTES).slice(0, slots);
        setUploading((count) => count + chosen.length);
        await Promise.all(chosen.map(async (file) => {
            try {
                const body = new FormData();
                body.append("file", file);
                const response = await fetch(`${API_URL}/api/v1/media_objects`, {
                    method: "POST",
                    credentials: "include",
                    headers: { Accept: "application/ld+json", ...(viewer.token ? { Authorization: `Bearer ${viewer.token}` } : {}) },
                    body,
                });
                if (!response.ok) throw new Error(String(response.status));
                const media = await response.json() as { id: string; contentUrl: string; thumbnails?: { small?: string } | null };
                setPhotos((prev) => [...prev, { id: media.id, url: media.thumbnails?.small || media.contentUrl }]);
            } catch {
                setError(labels.sendError);
            } finally {
                setUploading((count) => count - 1);
            }
        }));
    };

    const send = async () => {
        if (!viewer.canReview || !text.trim() || rating === null) return;
        try {
            const { error: apiError } = await api().POST("/api/v1/review-vacancy", {
                body: { vacancyId: offerId, description: text.trim(), rating, imageIds: photos.map((photo) => photo.id) } as never,
            });
            if (apiError) throw new Error("review");
            setSent(true);
            setText("");
            setRating(null);
            setPhotos([]);
            await load(1);
        } catch {
            setError(labels.sendError);
        }
    };

    const remove = async (id: string) => {
        if (!window.confirm(labels.deleteConfirm)) return;
        try {
            const { error: apiError } = await api().DELETE("/api/v1/review-vacancy/{id}", { params: { path: { id } } });
            if (apiError) throw new Error("delete");
            setReviews((prev) => prev.filter((review) => review.id !== id));
        } catch {
            setError(labels.deleteError);
        }
    };

    return (
        <div id="review" className="mt-[60px] mb-5 flex flex-col border-t border-caption pt-[30px] down-sm:mt-10 down-sm:pt-5">
            <SectionTitle>{labels.title}</SectionTitle>
            {viewer.canReview && (
                <>
                    <div role="radiogroup" aria-label={labels.rating} className="flex">
                        {[1, 2, 3, 4, 5].map((value) => (
                            <button
                                key={value}
                                type="button"
                                role="radio"
                                aria-checked={rating === value}
                                aria-label={String(value)}
                                disabled={sent}
                                onClick={() => setRating(value)}
                                className={`cursor-pointer text-[30px] leading-none disabled:cursor-default ${rating !== null && value <= rating ? "text-[#FED81C]" : "text-black/26"}`}
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
                            disabled={sent}
                            className="mt-2 box-border h-[7.375rem] w-full resize-none rounded-[10px] border border-[#82949F] p-3.5 text-[16px] outline-none disabled:cursor-not-allowed disabled:bg-disabled"
                        />
                        <button
                            type="button"
                            onClick={send}
                            disabled={!text.trim() || rating === null || uploading > 0}
                            className="mt-4 rounded-[10px] border border-primary px-[100px] py-3 text-label text-primary transition-all duration-300 hover:bg-primary hover:text-white disabled:opacity-70 disabled:hover:bg-transparent disabled:hover:text-primary down-lg:w-full down-lg:px-[15px]"
                        >
                            {labels.write}
                        </button>
                    </div>
                    {!sent && (
                        <div className="mt-4 flex w-full flex-wrap gap-5">
                            {photos.map((photo) => (
                                <div key={photo.id} className="relative h-[130px] w-[130px]">
                                    {/* eslint-disable-next-line @next/next/no-img-element -- загруженное фото */}
                                    <img src={photo.url} alt="" className="h-full w-full object-cover" />
                                    <button
                                        type="button"
                                        aria-label={labels.removePhoto}
                                        onClick={() => setPhotos((prev) => prev.filter((item) => item.id !== photo.id))}
                                        className="absolute top-2.5 right-[5px] flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-primary text-[12px] text-white"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            {photos.length < MAX_PHOTOS && (
                                <button
                                    type="button"
                                    onClick={() => fileInput.current?.click()}
                                    className="flex h-[130px] w-[130px] cursor-pointer flex-col items-center justify-center gap-2.5 border border-dashed border-caption bg-field text-center text-[14px] text-caption transition-all duration-300 hover:opacity-80"
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                                    <img src="/web/icons/offer/plus-icon.svg" alt="" />
                                    {uploading > 0 ? "…" : labels.addPhoto}
                                </button>
                            )}
                            <input
                                ref={fileInput}
                                type="file"
                                accept="image/*"
                                multiple
                                hidden
                                onChange={(event) => {
                                    void upload(event.target.files);
                                    event.target.value = "";
                                }}
                            />
                        </div>
                    )}
                </>
            )}
            <div className="mt-[30px] mb-5 flex flex-col gap-[30px] down-sm:mt-5 down-sm:mb-[15px] down-sm:gap-5">
                {error && <div>{error}</div>}
                {!error && reviews.length === 0 && labels.empty}
                {!error && reviews.map((review) => {
                    const name = personName(review.author, labels.anonymous);
                    const href = volunteerHref.replace("{id}", review.author.id);
                    const canDelete = viewer.profileId === review.author.id
                        && !!review.createdAt
                        && now - new Date(review.createdAt).getTime() < DELETE_WINDOW_MS;
                    const images = review.images.map((image) => mediaUrl(image, "large")).filter((url): url is string => !!url);
                    return (
                        <div key={review.id} className="relative flex w-full flex-col gap-2">
                            {canDelete && (
                                <button type="button" onClick={() => remove(review.id)} aria-label={labels.delete} className="absolute top-0 right-0 cursor-pointer p-1">
                                    {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                                    <img src="/web/icons/offer/delete.svg" alt="" className="h-4 w-4" />
                                </button>
                            )}
                            <p className="text-[14px] font-medium whitespace-pre-line">{review.description}</p>
                            {review.images.length > 0 && (
                                <div className="mt-1.5 flex flex-wrap gap-1.5">
                                    {review.images.slice(0, 4).map((image, index) => (
                                        <button
                                            key={image.id}
                                            type="button"
                                            onClick={() => setGallery({ images, index })}
                                            className="relative h-14 w-14 shrink-0 cursor-pointer overflow-hidden rounded-[6px]"
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element -- превью из хранилища */}
                                            <img src={mediaUrl(image, "small")} alt="" className="block h-full w-full object-cover" />
                                            {index === 3 && review.images.length > 4 && (
                                                <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-[14px] font-semibold text-white">
                                                    {`+${review.images.length - 4}`}
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
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
            <GalleryLightbox images={gallery?.images ?? []} index={gallery?.index ?? null} onClose={() => setGallery(null)} labels={labels.gallery} />
        </div>
    );
}
