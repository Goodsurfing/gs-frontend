"use client";

import { memo, useEffect, useState } from "react";

import { Avatar } from "@/components/ui/Avatar";
import { browserApi } from "@/lib/browserApi";
import { mediaUrl } from "@/lib/media";
import { idFromIri, isImageAttachment, linkify } from "@/lib/messenger";

import { ReadMark } from "./ReadMark";

type Media = { contentUrl?: string | null; thumbnails?: unknown; originalName?: string | null };

/** Вложение по IRI: у сообщения в списке только ссылка, сам файл запрашивается отдельно */
function useAttachment(token: string | undefined, iri: string | undefined) {
    const [media, setMedia] = useState<Media | null>(null);
    useEffect(() => {
        const id = idFromIri(iri);
        if (!id) return;
        let cancelled = false;
        void browserApi(token)
            .GET("/api/v1/media_objects/{id}", { params: { path: { id } } })
            .then(({ data }) => {
                if (!cancelled && data) setMedia(data as Media);
            })
            .catch(() => undefined);
        return () => {
            cancelled = true;
        };
    }, [iri, token]);
    return media;
}

/**
 * Сообщение (как в Worldpackers и привычных мессенджерах): свои — синие
 * справа, с временем и галочками прочтения; собеседника — белые слева.
 * Подряд идущие сообщения одного автора — группа: аватар собеседника только
 * у последнего в группе, между сообщениями группы отступ меньше.
 */
export const MessageBubble = memo(function MessageBubble({ own, name, avatar, showAvatar, profileHref, text, attachment, time, read, readLabel, groupEnd, token, onImage }: {
    own: boolean;
    name: string;
    avatar?: string;
    /** Последнее сообщение собеседника в группе — с аватаром */
    showAvatar: boolean;
    profileHref?: string;
    text: string;
    /** IRI первого вложения */
    attachment?: string;
    time: string;
    /** Своё сообщение прочитано собеседником */
    read: boolean;
    readLabel: string;
    /** Последнее сообщение группы — отступ до следующей группы больше */
    groupEnd: boolean;
    token: string | undefined;
    onImage: (src: string) => void;
}) {
    const media = useAttachment(token, attachment);
    const contentUrl = media?.contentUrl ?? "";
    const image = contentUrl && isImageAttachment(contentUrl) ? media : null;
    const file = contentUrl && !image ? media : null;
    const pending = !!attachment && !media;

    const avatarNode = <Avatar src={avatar} name={name} size={32} />;
    const meta = (
        <span className={`ml-auto flex shrink-0 items-center gap-0.5 self-end pl-2 text-[11px] leading-none ${own ? "text-white/80" : "text-caption"}`}>
            {time}
            {own && <ReadMark read={read} label={readLabel} className={`mr-0 ml-0.5 ${read ? "text-white!" : "text-white/70!"}`} />}
        </span>
    );
    return (
        <div className={`flex w-full items-end gap-2 ${own ? "justify-end" : "justify-start"} ${groupEnd ? "mt-3" : "mt-0.5"}`}>
            {!own && (
                <div className="w-8 shrink-0">
                    {showAvatar && (profileHref ? <a href={profileHref} aria-label={name}>{avatarNode}</a> : avatarNode)}
                </div>
            )}
            <div
                className={`flex max-w-[min(75%,520px)] flex-col gap-1.5 ${image || pending ? "p-1.5" : "px-3.5 py-2"} ${own ? "rounded-[18px] bg-primary text-white" : "rounded-[18px] bg-white text-ink-secondary shadow-[0_1px_2px_rgba(14,29,39,0.08)]"} ${showAvatar && !own ? "rounded-bl-[6px]" : ""} ${groupEnd && own ? "rounded-br-[6px]" : ""}`}
            >
                {pending && <span aria-hidden className="block h-[220px] w-[280px] max-w-full animate-pulse rounded-[12px] bg-field/60" />}
                {image && (
                    <button type="button" onClick={() => onImage(mediaUrl(image) ?? "")} className="cursor-pointer border-0 bg-transparent p-0">
                        {/* eslint-disable-next-line @next/next/no-img-element -- вложение с API, размер неизвестен */}
                        <img loading="lazy" src={mediaUrl(image, "medium")} alt="" className="h-[220px] w-[280px] max-w-full rounded-[12px] bg-field object-cover" />
                    </button>
                )}
                {file && (
                    <a href={mediaUrl(file)} download target="_blank" rel="noreferrer" className={`flex items-center gap-2 break-all no-underline ${own ? "text-white" : "text-inherit hover:text-primary"}`}>
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${own ? "bg-white/20" : "bg-primary"}`}>
                            {/* eslint-disable-next-line @next/next/no-img-element -- значок файла */}
                            <img src="/web/icons/messenger/file.svg" alt="" className="h-5 w-5 brightness-0 invert" />
                        </span>
                        <span className="text-[14px]">{file.originalName || contentUrl.split("/").pop()}</span>
                    </a>
                )}
                <div className={`flex flex-wrap items-end ${image || pending ? "px-2 pb-1" : ""}`}>
                    {text && (
                        <p
                            className="text-[15px] leading-[140%] break-words whitespace-pre-line"
                            // linkify экранирует весь текст, добавляет только <a>
                            dangerouslySetInnerHTML={{ __html: linkify(text) }}
                        />
                    )}
                    {meta}
                </div>
            </div>
        </div>
    );
});
