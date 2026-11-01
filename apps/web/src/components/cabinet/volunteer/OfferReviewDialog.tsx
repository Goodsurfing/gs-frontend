"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { type ReactNode, useState } from "react";

import { TextAreaField } from "@/components/form/fields";

// Звёзды MUI Rating старого фронта: выбранная — Star, пустая — контур StarBorder
const STAR = "M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";
const STAR_BORDER = "m22 9.24-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28z";

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
 * только сообщение об успехе.
 */
export function OfferReviewDialog({ open, offer, labels, onSend, onClose }: {
    open: boolean;
    /** Карточка вакансии над оценкой */
    offer: ReactNode;
    labels: OfferReviewDialogLabels;
    /** Отправка; вернуть текст ошибки или null */
    onSend: (review: { rating: number; text: string }) => Promise<string | null>;
    onClose: () => void;
}) {
    const [rating, setRating] = useState<number | null>(null);
    const [text, setText] = useState("");
    const [busy, setBusy] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const close = () => {
        setRating(null);
        setText("");
        setSent(false);
        setError(null);
        onClose();
    };

    const send = async () => {
        if (!rating || !text || busy) return;
        setBusy(true);
        setError(null);
        const failure = await onSend({ rating, text });
        setBusy(false);
        setRating(null);
        setText("");
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
                                    {error && <p role="alert" className="text-[0.875rem] text-error">{error}</p>}
                                    {!rating && <p className="text-[14px] text-error">{labels.hint}</p>}
                                    <button
                                        type="button"
                                        onClick={send}
                                        disabled={!rating || !text || busy}
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
