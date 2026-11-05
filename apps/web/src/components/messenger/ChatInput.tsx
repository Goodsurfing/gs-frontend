"use client";

import dynamic from "next/dynamic";
import { type KeyboardEvent, type ReactNode, useEffect, useRef, useState } from "react";

import { Spinner } from "@/components/ui/Spinner";
import { MAX_UPLOAD_SIZE, uploadMedia } from "@/lib/uploadMedia";

// Окно смайлов тяжёлое — грузится только по кнопке
const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export interface ChatInputLabels {
    placeholder: string;
    attach: string;
    emoji: string;
    send: string;
    removeAttachment: string;
    tooLarge: string;
    uploadError: string;
    /** Разделы смайлов — как в старом фронте: люди, животные, еда */
    emojiSmileys: string;
    emojiAnimals: string;
    emojiFood: string;
}

export interface OutgoingMessage { text: string; attachments: string[] }

const iconButton = "flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 disabled:cursor-default";
const mask = (name: string) => ({ maskImage: `url(/web/icons/messenger/${name}.svg)`, WebkitMaskImage: `url(/web/icons/messenger/${name}.svg)` });

/**
 * Поле сообщения (ChatInput старого фронта): скрепка — одно вложение до
 * 5 МБ, многострочный текст (Enter — отправить, Shift+Enter — новая строка),
 * смайлы, стрелка отправки. Пустое сообщение без вложения не уходит.
 */
export function ChatInput({ token, disabled, labels, onSend, onError, prefill, extra }: {
    token: string | undefined;
    disabled: boolean;
    labels: ChatInputLabels;
    onSend: (message: OutgoingMessage) => void;
    onError: (text: string) => void;
    /** Текст, который надо подставить в поле (черновик ответа); key — чтобы подставить и тот же текст повторно */
    prefill?: { text: string; key: number } | null;
    /** Над полем: кнопка «Предложить ответ» */
    extra?: ReactNode;
}) {
    const [text, setText] = useState("");
    const [attachment, setAttachment] = useState<{ name: string; iri: string } | null>(null);
    const [uploading, setUploading] = useState(false);
    const [emoji, setEmoji] = useState(false);
    const textRef = useRef<HTMLTextAreaElement>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const emojiRef = useRef<HTMLDivElement>(null);

    // Смайлы закрываются щелчком мимо окна
    useEffect(() => {
        if (!emoji) return;
        const close = (event: MouseEvent) => {
            if (!emojiRef.current?.contains(event.target as Node)) setEmoji(false);
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, [emoji]);

    // Черновик подставляется в поле и остаётся на правку — отправляет человек сам
    useEffect(() => {
        if (!prefill) return;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setText(prefill.text);
        textRef.current?.focus();
    }, [prefill]);

    // Высота поля — по тексту, не больше 10 строк
    useEffect(() => {
        const area = textRef.current;
        if (!area) return;
        area.style.height = "auto";
        area.style.height = `${Math.min(area.scrollHeight, 10 * 23)}px`;
    }, [text]);

    const canSend = !disabled && (!!text.trim() || !!attachment);

    const send = () => {
        if (!canSend) return;
        onSend({ text, attachments: attachment ? [attachment.iri] : [] });
        setText("");
        setAttachment(null);
    };

    const keyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            send();
        }
    };

    const attach = async (file: File | undefined) => {
        if (!file) return;
        if (file.size > MAX_UPLOAD_SIZE) {
            onError(labels.tooLarge);
            return;
        }
        setUploading(true);
        try {
            const media = await uploadMedia(file, token);
            setAttachment({ name: file.name, iri: media["@id"] });
        } catch {
            onError(labels.uploadError);
        } finally {
            setUploading(false);
            if (fileRef.current) fileRef.current.value = "";
            textRef.current?.focus();
        }
    };

    return (
        <div className="border-t border-accent-bg">
        {extra}
        <div className="relative flex items-center gap-2 px-4 py-2">
            {attachment && (
                <div className="absolute bottom-full left-0 flex w-full items-center gap-[15px] bg-white p-5 text-primary">
                    {attachment.name}
                    <button type="button" aria-label={labels.removeAttachment} onClick={() => setAttachment(null)} className={iconButton}>
                        <span aria-hidden className="h-5 w-5 bg-caption" style={mask("delete")} />
                    </button>
                </div>
            )}
            <div className="flex w-full min-w-[150px] items-center rounded-[10px] border border-caption bg-white px-3.5 py-2.5">
                {uploading ? <Spinner className="w-5! [&_svg]:h-5 [&_svg]:w-5" /> : (
                    <button type="button" aria-label={labels.attach} onClick={() => fileRef.current?.click()} className={iconButton}>
                        {/* eslint-disable-next-line @next/next/no-img-element -- значок без заливки, только контур */}
                        <img src="/web/icons/messenger/clip.svg" alt="" className="h-5 w-5" />
                    </button>
                )}
                <input ref={fileRef} type="file" hidden onChange={(event) => void attach(event.target.files?.[0])} />
                <textarea
                    ref={textRef}
                    rows={1}
                    value={text}
                    aria-label={labels.placeholder}
                    placeholder={labels.placeholder}
                    onChange={(event) => setText(event.target.value)}
                    onKeyDown={keyDown}
                    className="ml-2 max-h-[230px] flex-1 resize-none border-0 bg-transparent p-0 font-[Roboto,Helvetica,Arial,sans-serif] text-[16px] leading-[1.4375em] text-black outline-none"
                />
                <div ref={emojiRef} className="relative">
                    <button type="button" aria-label={labels.emoji} aria-expanded={emoji} onClick={() => setEmoji((value) => !value)} className={iconButton}>
                        {/* eslint-disable-next-line @next/next/no-img-element -- значок без заливки, только контур */}
                        <img src="/web/icons/messenger/chat-smile.svg" alt="" className="h-5 w-5" />
                    </button>
                    {emoji && (
                        <div className="absolute right-0 bottom-[300%] z-10 down-lg:w-[70vw] down-xs:-right-[180%] down-xs:w-[85vw]">
                            <EmojiPicker
                                lazyLoadEmojis
                                width="100%"
                                // Значения перечисления Categories из emoji-picker-react: сам модуль грузится только по кнопке
                                categories={[
                                    { category: "smileys_people", name: labels.emojiSmileys },
                                    { category: "animals_nature", name: labels.emojiAnimals },
                                    { category: "food_drink", name: labels.emojiFood },
                                ] as never}
                                onEmojiClick={(data) => setText((value) => value + data.emoji)}
                            />
                        </div>
                    )}
                </div>
            </div>
            <button type="button" aria-label={labels.send} disabled={!canSend} onClick={send} className={iconButton}>
                <span aria-hidden className={`h-5 w-5 ${canSend ? "bg-primary" : "bg-caption"}`} style={mask("send-arrow")} />
            </button>
        </div>
        </div>
    );
}
