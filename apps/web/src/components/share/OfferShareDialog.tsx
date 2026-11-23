"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";

import { Spinner } from "@/components/ui/Spinner";
import type { Locale } from "@/i18n/config";
import { offerShareCopy, offerShareText, shareLinks, withShareMark, type OfferShareFacts } from "@/lib/share";

export interface OfferShareLabels {
    title: string;
    /** Подзаголовок: «Вакансия опубликована — расскажите подписчикам» и т. п. */
    intro: string;
    text: string;
    copy: string;
    copied: string;
    downloadPost: string;
    downloadStory: string;
    maxHint: string;
    close: string;
    error: string;
}

const button = "inline-flex cursor-pointer items-center justify-center gap-2 rounded-[10px] border px-4 py-2.5 text-[15px] leading-[120%] no-underline transition-all duration-300";

/**
 * «Поделиться вакансией» — для организатора (кабинет, сразу после публикации) и
 * волонтёра (принятая заявка): картинка-карточка, готовый текст поста, кнопки
 * VK / Telegram / WhatsApp, копирование для MAX и Instagram, картинки для поста
 * и сторис. Ссылка с меткой — видно в Метрике, сколько людей пришло из публикаций.
 */
export function OfferShareDialog({ open, onOpenChange, offerId, offerUrl, cardUrl, source, locale, labels }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    offerId: string;
    /** Полный адрес страницы вакансии (без метки) */
    offerUrl: string;
    /** Адрес картинки-карточки: /offers/:id/card (для сторис — ?format=story) */
    cardUrl: string;
    source: "host" | "volunteer";
    locale: Locale;
    labels: OfferShareLabels;
}) {
    const [facts, setFacts] = useState<OfferShareFacts | null>(null);
    const [failed, setFailed] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!open || facts) return;
        let cancelled = false;
        fetch(`${cardUrl.replace(/\/card$/, "")}/share`)
            .then((response) => (response.ok ? response.json() as Promise<OfferShareFacts> : Promise.reject(new Error(String(response.status)))))
            .then((data) => !cancelled && setFacts(data))
            .catch(() => !cancelled && setFailed(true));
        return () => {
            cancelled = true;
        };
    }, [open, facts, cardUrl, offerId]);

    const url = withShareMark(offerUrl, source);
    const text = facts ? offerShareText(facts, source, locale) : "";
    const links = shareLinks(url, text);
    const copy = () => {
        void navigator.clipboard?.writeText(offerShareCopy(text, url, locale)).then(() => setCopied(true)).catch(() => setCopied(false));
    };

    return (
        <Dialog.Root open={open} onOpenChange={(next) => { onOpenChange(next); if (!next) setCopied(false); }}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-[999] flex animate-fade-in justify-center overflow-y-auto bg-black/50 px-4 py-10">
                    <Dialog.Content className="relative flex w-[560px] max-w-full flex-col gap-4 self-center rounded-[12px] bg-white p-6 outline-none down-sm:p-4">
                        <Dialog.Title className="pr-8 text-[1.375rem] leading-[1.3] font-bold text-ink">{labels.title}</Dialog.Title>
                        <Dialog.Description className="text-[15px] leading-[1.5] text-ink-secondary">{labels.intro}</Dialog.Description>
                        <Dialog.Close aria-label={labels.close} className="absolute top-5 right-5 cursor-pointer text-caption hover:text-ink">
                            <svg aria-hidden width="16" height="16" viewBox="0 0 14 14" fill="currentColor" className="block">
                                <path fillRule="evenodd" clipRule="evenodd" d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" />
                            </svg>
                        </Dialog.Close>

                        {/* Место под карточку зарезервировано (1200×630), пока она рисуется — фон */}
                        <div className="relative aspect-[1200/630] w-full overflow-hidden rounded-[8px] bg-field">
                            {/* eslint-disable-next-line @next/next/no-img-element -- картинка рисуется сервером */}
                            <img loading="eager" src={cardUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
                        </div>

                        {failed ? (
                            <p role="alert" className="text-[14px] text-error">{labels.error}</p>
                        ) : !facts ? (
                            <div className="flex justify-center py-3"><Spinner /></div>
                        ) : (
                            <>
                                <label className="flex flex-col gap-1.5 text-[14px] text-ink-secondary">
                                    {labels.text}
                                    <textarea readOnly rows={4} value={offerShareCopy(text, url, locale)} onFocus={(event) => event.currentTarget.select()} className="resize-none rounded-[10px] border border-[#e0e0e0] bg-field px-3 py-2.5 text-[14px] leading-[1.45] text-ink" />
                                </label>
                                <div className="flex flex-wrap gap-2.5">
                                    <a href={links.vk} target="_blank" rel="noopener noreferrer" className={`${button} border-[#0077FF] bg-[#0077FF] text-white hover:bg-white hover:text-[#0077FF]`}>ВКонтакте</a>
                                    <a href={links.telegram} target="_blank" rel="noopener noreferrer" className={`${button} border-[#229ED9] bg-[#229ED9] text-white hover:bg-white hover:text-[#229ED9]`}>Telegram</a>
                                    <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" className={`${button} border-[#25D366] bg-[#25D366] text-white hover:bg-white hover:text-[#25D366]`}>WhatsApp</a>
                                    <button type="button" onClick={copy} className={`${button} border-primary text-primary hover:bg-primary hover:text-white`}>{copied ? labels.copied : labels.copy}</button>
                                </div>
                                <p className="text-[13px] leading-[1.4] text-caption">{labels.maxHint}</p>
                                <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-[#eee] pt-3 text-[14px]">
                                    <a href={cardUrl} download={`goodsurfing-${offerId}.jpg`} className="text-primary underline">{labels.downloadPost}</a>
                                    <a href={`${cardUrl}?format=story`} download={`goodsurfing-${offerId}-story.jpg`} className="text-primary underline">{labels.downloadStory}</a>
                                </div>
                            </>
                        )}
                    </Dialog.Content>
                </Dialog.Overlay>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
