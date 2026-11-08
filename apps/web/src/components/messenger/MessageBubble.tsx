"use client";

import { memo, useEffect, useState } from "react";

import { Avatar } from "@/components/ui/Avatar";
import { browserApi } from "@/lib/browserApi";
import { mediaUrl } from "@/lib/media";
import { idFromIri, isImageAttachment, linkify } from "@/lib/messenger";

type Media = { contentUrl?: string | null; thumbnails?: unknown; originalName?: string | null };

/** Вложение сообщения: API отдаёт его объектом (с адресом файла), а иногда — ссылкой-IRI */
export type Attachment = string | (Media & { "@id"?: string; id?: string });

/**
 * Файл вложения. Объект с адресом — сразу; IRI или объект без адреса — запрос файла.
 * Раньше ждали только строку: объект ломал чат («e?.split is not a function», Bugsink 08.11.2026),
 * а картинки во вложениях не показывались.
 */
function useAttachment(token: string | undefined, attachment: Attachment | undefined) {
    const inline = typeof attachment === "object" && attachment?.contentUrl ? attachment : null;
    const id = inline ? undefined : typeof attachment === "string" ? idFromIri(attachment) : attachment?.id ?? idFromIri(attachment?.["@id"]);
    const [fetched, setFetched] = useState<Media | null>(null);
    useEffect(() => {
        if (!id) return;
        let cancelled = false;
        void browserApi(token)
            .GET("/api/v1/media_objects/{id}", { params: { path: { id } } })
            .then(({ data }) => {
                if (!cancelled && data) setFetched(data as Media);
            })
            .catch(() => undefined);
        return () => {
            cancelled = true;
        };
    }, [id, token]);
    return inline ?? fetched;
}

/**
 * Сообщение (Message старого фронта): аватар со ссылкой на профиль, пузырь
 * с текстом (ссылки кликабельны), картинкой или файлом и временем. Свои
 * сообщения — справа, собеседника — слева, с именем.
 */
export const MessageBubble = memo(function MessageBubble({ own, name, avatar, profileHref, text, attachment, date, token, onImage }: {
    own: boolean;
    name: string;
    avatar?: string;
    profileHref?: string;
    text: string;
    /** IRI первого вложения */
    attachment?: Attachment;
    date: string;
    token: string | undefined;
    onImage: (src: string) => void;
}) {
    const media = useAttachment(token, attachment);
    const contentUrl = media?.contentUrl ?? "";
    const image = contentUrl && isImageAttachment(contentUrl) ? media : null;
    const file = contentUrl && !image ? media : null;

    const avatarNode = <Avatar src={avatar} name={name} size={30} />;
    return (
        <div className={`flex w-full max-w-[446px] items-start down-xs:max-w-[280px] ${own ? "ml-auto flex-row-reverse self-end" : "self-start"}`}>
            <div className="self-end">{profileHref ? <a href={profileHref} aria-label={name}>{avatarNode}</a> : avatarNode}</div>
            <div className={`flex flex-col gap-1 rounded-[10px] ${image ? "max-w-[420px] gap-2 p-2" : "px-4 py-2"} ${own ? "mr-2 bg-accent-bg" : "ml-2 bg-white"}`}>
                {!own && <span className="text-[0.75rem] text-primary">{name}</span>}
                {image && (
                    <button type="button" onClick={() => onImage(mediaUrl(image) ?? "")} className="cursor-pointer border-0 bg-transparent p-0">
                        {/* eslint-disable-next-line @next/next/no-img-element -- вложение с API, размер неизвестен */}
                        <img loading="eager" src={mediaUrl(image, "medium")} alt="" className="w-full rounded-[10px] object-contain" />
                    </button>
                )}
                {file && (
                    <a href={mediaUrl(file)} download target="_blank" rel="noreferrer" className="flex items-center gap-2 break-all text-inherit no-underline transition-all duration-300 hover:text-primary">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary">
                            {/* eslint-disable-next-line @next/next/no-img-element -- значок файла */}
                            <img src="/web/icons/messenger/file.svg" alt="" className="h-5 w-5 brightness-0 invert" />
                        </span>
                        <span>{file.originalName || contentUrl.split("/").pop()}</span>
                    </a>
                )}
                {text && (
                    <p
                        className="text-[0.875rem] font-medium break-words whitespace-pre-line text-ink-secondary"
                        // linkify экранирует весь текст, добавляет только <a>
                        dangerouslySetInnerHTML={{ __html: linkify(text) }}
                    />
                )}
                <span className="self-end text-[0.75rem] font-medium text-caption">{date}</span>
            </div>
        </div>
    );
});
