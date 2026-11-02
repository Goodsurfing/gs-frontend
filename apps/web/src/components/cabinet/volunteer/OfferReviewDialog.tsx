"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { type ReactNode, useRef, useState } from "react";

import { ImagesUploader, type ImagesUploaderLabels } from "@/components/cabinet/ImagesUploader";
import { TextAreaField } from "@/components/form/fields";
import type { UploadedMedia } from "@/lib/mediaUpload";

import { STAR, STAR_BORDER } from "./StarRating";

export interface OfferReviewDialogLabels {
    title: string;
    rating: string;
    text: string;
    hint: string;
    send: string;
    sent: string;
    close: string;
}

/**
 * Окно «Оставьте отзыв» о вакансии (VolunteerModalReview + ModalReview
 * старого фронта): карточка вакансии, оценка звёздами, текст до 500 знаков.
 * Отправить можно только с оценкой и текстом; после отправки в окне —
 * только сообщение об успехе. С photos — ещё фото к отзыву (до 10), как на
 * странице «Отзывы»: пока фото загружаются, отправить нельзя; при закрытии окна
 * загрузки отменяются и в следующее окно не попадают.
 */
export function OfferReviewDialog({ open, offer, labels, photos, onSend, onClose }: {
    open: boolean;
    /** Карточка вакансии над оценкой */
    offer: ReactNode;
    labels: OfferReviewDialogLabels;
    /** Фото к отзыву: токен для загрузки, подписи загрузчика и текст ошибки загрузки */
    photos?: { token: string | undefined; labels: ImagesUploaderLabels; error: string };
    /** Отправка; вернуть текст ошибки или null */
    onSend: (review: { rating: number; text: string; imageIds: string[] }) => Promise<string | null>;
    onClose: () => void;
}) {
    const [rating, setRating] = useState<number | null>(null);
    const [text, setText] = useState("");
    const [busy, setBusy] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [images, setImages] = useState<UploadedMedia[]>([]);
    const [uploading, setUploading] = useState(false);
    // Загрузчик пересоздаётся на каждое открытие: его загрузки отменяются вместе с окном
    const [round, setRound] = useState(0);
    // Номер «сеанса» окна: ответ отправки, пришедший после закрытия, не должен попасть в следующее окно
    const session = useRef(0);

    const close = () => {
        session.current += 1;
        setRound((value) => value + 1);
        setUploading(false);
        setBusy(false);
        setRating(null);
        setText("");
        setImages([]);
        setSent(false);
        setError(null);
        onClose();
    };

    const send = async () => {
        if (!rating || !text || busy || uploading) return;
        setBusy(true);
        setError(null);
        const current = session.current;
        const failure = await onSend({ rating, text, imageIds: images.map((image) => image.id) });
        if (current !== session.current) return;
        setBusy(false);
        setRating(null);
        setText("");
        setImages([]);
        if (failure) setError(failure);
        else setSent(true);
    };

    return (
        <Dialog.Root open={open} onOpenChange={(value) => !value && close()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-[999] flex animate-fade-in justify-center overflow-y-auto bg-black/50 py-10">
                    <Dialog.Content aria-describedby={undefined} className="relative self-center">
                        <Dialog.Close aria-label={labels.close} className="absolute top-0 -right-10 cursor-pointer text-white down-md:top-[-12%] down-md:right-[5%] down-md:bottom-[110%]">
                            <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" className="block fill-current">
                                <path fillRule="evenodd" clipRule="evenodd" d="M14 1.41 12.59 0 7 5.59 1.41 0 0 1.41 5.59 7 0 12.59 1.41 14 7 8.41 12.59 14 14 12.59 8.41 7 14 1.41Z" />
                            </svg>
                        </Dialog.Close>
                        <div className="flex max-w-[600px] flex-col gap-[15px] rounded-[20px] bg-white p-[25px]">
                            {sent ? <Dialog.Title className="text-[1.5em] font-bold">{labels.sent}</Dialog.Title> : (
                                <>
                                    <Dialog.Title className="text-[1.5em] font-bold">{labels.title}</Dialog.Title>
                                    {offer}
                                    <div role="radiogroup" aria-label={labels.rating} className="flex">
                                        {[1, 2, 3, 4, 5].map((value) => (
                                            <button
                                                key={value}
                                                type="button"
                                                role="radio"
                                                aria-checked={rating === value}
                                                aria-label={String(value)}
                                                onClick={() => setRating(value)}
                                                className={`cursor-pointer ${rating !== null && value <= rating ? "text-[#FED81C]" : "text-black/26"}`}
                                            >
                                                <svg aria-hidden viewBox="0 0 24 24" className="block h-[1.875rem] w-[1.875rem] fill-current"><path d={rating !== null && value <= rating ? STAR : STAR_BORDER} /></svg>
                                            </button>
                                        ))}
                                    </div>
                                    {/* Отступ 5 px снизу — как у строчной textarea с <br> в старом Textarea */}
                                    <TextAreaField className="pb-[5px]" label={labels.text} value={text} maxLength={500} onChange={(event) => setText(event.target.value)} />
                                    {photos && (
                                        <ImagesUploader
                                            key={round}
                                            items={images}
                                            token={photos.token}
                                            labels={photos.labels}
                                            onUpload={async (media) => setImages((prev) => [...prev, ...media])}
                                            onDelete={(id) => setImages((prev) => prev.filter((image) => image.id !== id))}
                                            onBusyChange={setUploading}
                                            onError={(message) => setError(message ?? photos.error)}
                                        />
                                    )}
                                    {error && <p role="alert" className="text-[0.875rem] text-error">{error}</p>}
                                    {!rating && <p className="text-[14px] text-error">{labels.hint}</p>}
                                    <button
                                        type="button"
                                        onClick={send}
                                        disabled={!rating || !text || busy || uploading}
                                        className="flex cursor-pointer items-center justify-center rounded-[10px] border border-primary bg-primary px-[100px] py-3 text-center text-label text-white transition-all duration-300 hover:bg-white hover:text-primary disabled:cursor-default disabled:opacity-70 disabled:hover:bg-primary disabled:hover:text-white down-lg:w-full down-lg:px-[15px]"
                                    >
                                        {labels.send}
                                    </button>
                                </>
                            )}
                        </div>
                    </Dialog.Content>
                </Dialog.Overlay>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
