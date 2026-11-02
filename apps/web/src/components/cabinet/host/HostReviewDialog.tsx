"use client";

import type { components } from "@goodsurfing/api";
import * as Dialog from "@radix-ui/react-dialog";
import { useRef, useState } from "react";

import { type PendingPhoto, PhotoUploader } from "@/components/cabinet/PhotoUploader";
import { blueButton, NotesTextAreaField } from "@/components/form/fields";
import { useSession } from "@/components/session/SessionProvider";
import { Avatar } from "@/components/ui/Avatar";
import { StarRating } from "@/components/ui/StarRating";
import { browserApi } from "@/lib/browserApi";
import { mediaUrl } from "@/lib/media";
import { MAX_UPLOAD_SIZE, uploadMedia } from "@/lib/uploadMedia";

type Image = components["schemas"]["ImageResultDto"];

/** Кому пишется отзыв: волонтёр и вакансия, по которой он был принят */
export interface ReviewTarget {
    vacancyId: number;
    volunteerId: string;
    firstName?: string | null;
    lastName?: string | null;
    image?: Image | null;
    country?: string | null;
    city?: string | null;
    /** Статус заявки — бейдж на карточке */
    status: string;
}

const MAX_PHOTOS = 10;

export interface HostReviewDialogLabels {
    title: string;
    write: string;
    needRating: string;
    send: string;
    sent: string;
    error: string;
    close: string;
    rating: string;
    anonymous: string;
    statuses: Record<string, string>;
    photo: { add: string; drop: string; remove: string; photo: string; tooMany: string; tooBig: string };
}

const STATUS_BG: Record<string, string> = { new: "bg-primary", accepted: "bg-host", canceled: "bg-status-rejected" };

/**
 * Отзыв о волонтёре (HostModalReview старого фронта): карточка волонтёра со
 * статусом заявки, звёзды 1–5, текст до 500 знаков и до 10 фото. Отправить
 * можно с оценкой и текстом; после отправки — «Ваш отзыв был отправлен».
 * В старом при ошибке форма стиралась — здесь введённое остаётся.
 */
export function HostReviewDialog({ volunteer, volunteerHref, title, photos: withPhotos = true, initialRating = null, onClose, onSent, labels }: {
    volunteer: ReviewTarget | null;
    /** Оценка, уже выбранная в письме «Как всё прошло?» */
    initialRating?: number | null;
    /** Заголовок окна на виду (рабочий стол, заявки); без него — пустой, как на «Отзывах» */
    title?: string;
    /** Можно ли приложить фото (на «Отзывах» — да, в заявках — нет) */
    photos?: boolean;
    volunteerHref: string;
    onClose: () => void;
    onSent: () => void;
    labels: HostReviewDialogLabels;
}) {
    const session = useSession();
    const [rating, setRating] = useState<number | null>(volunteer ? initialRating : null);
    const [text, setText] = useState("");
    // При открытии окна — оценка из письма (если пришли по ссылке)
    const [wasOpen, setWasOpen] = useState(!!volunteer);
    if (!!volunteer !== wasOpen) {
        setWasOpen(!!volunteer);
        if (volunteer) setRating(initialRating);
    }
    const [photos, setPhotos] = useState<{ id: string; src: string }[]>([]);
    const [pending, setPending] = useState<PendingPhoto[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);
    const [sent, setSent] = useState(false);
    // Загрузки, отменённые «×», в отзыв не попадают
    const cancelled = useRef(new Set<string>());

    const close = () => {
        setRating(null);
        setText("");
        setPhotos([]);
        setPending([]);
        setError(null);
        setSent(false);
        onClose();
    };

    const addPhotos = async (files: File[]) => {
        const free = MAX_PHOTOS - photos.length;
        if (free <= 0) {
            setError(labels.photo.tooMany);
            return;
        }
        const batch = files.slice(0, free).map((file) => ({ file, key: `${Date.now()}-${Math.random()}`, preview: URL.createObjectURL(file) }));
        setPending((prev) => [...prev, ...batch.map(({ key, preview, file }) => ({ key, preview, error: file.size > MAX_UPLOAD_SIZE ? labels.photo.tooBig : undefined }))]);
        await Promise.all(batch.filter(({ file }) => file.size <= MAX_UPLOAD_SIZE).map(async ({ file, key }) => {
            try {
                const media = await uploadMedia(file, session.token);
                if (cancelled.current.has(key)) return;
                setPhotos((prev) => [...prev, { id: media.id, src: mediaUrl(media, "medium") ?? "" }]);
                setPending((prev) => prev.filter((item) => item.key !== key));
            } catch {
                setPending((prev) => prev.map((item) => (item.key === key ? { ...item, failed: true } : item)));
            }
        }));
    };

    const send = async () => {
        if (!volunteer || rating === null || !text) return;
        setBusy(true);
        setError(null);
        const { error: failed } = await browserApi(session.token).POST("/api/v1/review-volunteer", {
            body: { vacancyId: volunteer.vacancyId, volunteerId: volunteer.volunteerId, description: text, rating: rating as never, imageIds: photos.map((photo) => photo.id) },
        }).catch(() => ({ error: true }));
        setBusy(false);
        if (failed) {
            setError(labels.error);
            return;
        }
        setSent(true);
        onSent();
    };

    const person = volunteer ? `${volunteer.firstName ?? ""} ${volunteer.lastName ?? ""}`.trim() || labels.anonymous : "";
    const place = volunteer ? (volunteer.country && volunteer.city ? `${volunteer.country}, ${volunteer.city}` : volunteer.country || volunteer.city || "") : "";
    return (
        <Dialog.Root open={!!volunteer} onOpenChange={(open) => { if (!open) close(); }}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-[999] flex animate-fade-in justify-center overflow-y-auto bg-black/50 py-10">
                    <Dialog.Content aria-describedby={undefined} className="relative self-center outline-none">
                        <Dialog.Close aria-label={labels.close} className="absolute top-0 -right-10 cursor-pointer text-white down-md:top-[-12%] down-md:right-[5%]">
                            <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" fill="currentColor" className="block">
                                <path fillRule="evenodd" clipRule="evenodd" d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" />
                            </svg>
                        </Dialog.Close>
                        {sent ? (
                            <div className="flex max-w-[600px] flex-col gap-[15px] rounded-[20px] bg-white p-[25px]">
                                <Dialog.Title className="text-[1.5em] font-bold">{labels.sent}</Dialog.Title>
                            </div>
                        ) : (
                            <div className="flex max-w-[600px] flex-col gap-[15px] rounded-[20px] bg-white p-[25px]">
                                {title
                                    ? <Dialog.Title className="text-[1.5em] font-bold">{title}</Dialog.Title>
                                    : <Dialog.Title className="sr-only">{labels.title}</Dialog.Title>}
                                {volunteer && (
                                    // В старом над карточкой стоял пустой заголовок окна — 15 px сверху
                                    <div className={`${title ? "" : "mt-[15px]"} border border-accent-bg bg-white p-3.5 transition-all duration-300 hover:border-caption`}>
                                        <div className="relative flex">
                                            {labels.statuses[volunteer.status] && (
                                                <div className={`absolute top-0 right-0 px-1.5 py-0.5 text-[10px] text-white ${STATUS_BG[volunteer.status] ?? "bg-primary"}`}>{labels.statuses[volunteer.status]}</div>
                                            )}
                                            <a href={volunteerHref} aria-hidden tabIndex={-1}><Avatar src={mediaUrl(volunteer.image, "small")} name={person} size={56} /></a>
                                            <a href={volunteerHref} className="ml-2 flex flex-col text-inherit no-underline">
                                                <span className="text-[14px] font-medium text-ink-secondary">{person}</span>
                                                <span className="mt-2 text-[12px] text-caption">{place}</span>
                                            </a>
                                        </div>
                                    </div>
                                )}
                                {/* Rating MUI был на 5 px ниже строки — до поля 10 px, а не 15 */}
                                <div className="-mb-[5px]"><StarRating value={rating} size={30} label={labels.rating} onChange={setRating} /></div>
                                <NotesTextAreaField label={labels.write} maxLength={500} value={text} onChange={(event) => setText(event.target.value)} />
                                {withPhotos && (
                                    <PhotoUploader
                                        photos={photos.map((photo) => ({ key: photo.id, src: photo.src }))}
                                        pending={pending}
                                        onFiles={(files) => void addPhotos(files)}
                                        onRemove={(key) => setPhotos((prev) => prev.filter((photo) => photo.id !== key))}
                                        onCancel={(key) => {
                                            cancelled.current.add(key);
                                            setPending((prev) => prev.filter((item) => item.key !== key));
                                        }}
                                        labels={labels.photo}
                                    />
                                )}
                                {error && <p role="alert" className="my-[15px] text-[0.75rem] text-[#d32f2f]">{error}</p>}
                                {rating === null && <p className="text-[14px] text-error">{labels.needRating}</p>}
                                <div>
                                    <button type="button" disabled={busy || rating === null || !text} onClick={() => void send()} className={blueButton}>{labels.send}</button>
                                </div>
                            </div>
                        )}
                    </Dialog.Content>
                </Dialog.Overlay>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
