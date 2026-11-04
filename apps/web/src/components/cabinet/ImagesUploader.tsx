"use client";

import { useEffect, useId, useRef, useState } from "react";

import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import { mediaUrl } from "@/lib/media";
import { matchesAccept, MAX_UPLOAD_BYTES, type UploadedMedia, uploadMedia } from "@/lib/mediaUpload";

const MAX_FILES = 10;
const DOCUMENTS = "image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export interface ImagesUploaderLabels {
    add: string;
    drop: string;
    tooMany: string;
    tooBig: string;
    remove: string;
    gallery: { close: string; prev: string; next: string; photo: string };
}

/** uploading — идёт загрузка; done — загружен, ждёт остальных файлов пачки; saving — передан в onUpload; error — не загрузился */
type Status = "uploading" | "done" | "saving" | "error";

interface Pending {
    key: number;
    name: string;
    preview: string | null;
    status: Status;
    tooBig: boolean;
}

/**
 * Загрузка картинок и документов (ImagesUploader старого фронта): квадрат
 * «+ Добавить фото» 130×130 с пунктирной рамкой, перетаскивание файлов,
 * превью загруженных с крестиком. Больше 10 файлов (вместе с загружающимися)
 * и файлы больше 5 МБ не загружаются; картинка открывается в просмотрщике,
 * документ — по ссылке. Крестик у загружающегося файла отменяет загрузку;
 * при размонтировании (закрыли окно) все загрузки отменяются и в onUpload
 * ничего не попадает.
 */
export function ImagesUploader({ items, token, onUpload, onDelete, onError, onBusyChange, removeDisabled = false, onlyImages = true, labels }: {
    items: UploadedMedia[];
    token: string | undefined;
    onUpload: (media: UploadedMedia[]) => Promise<void>;
    onDelete: (id: string) => void;
    onError: (text?: string) => void;
    /** Идут ли загрузки (пока идут — например, нельзя отправить форму) */
    onBusyChange?: (busy: boolean) => void;
    /** Крестики у загруженных недоступны (родитель сохраняет список) */
    removeDisabled?: boolean;
    onlyImages?: boolean;
    labels: ImagesUploaderLabels;
}) {
    const inputId = useId();
    const counter = useRef(0);
    const [pending, setPending] = useState<Pending[]>([]);
    const [dragging, setDragging] = useState(false);
    const [lightbox, setLightbox] = useState<number | null>(null);
    // Состояние загрузок вне рендера: отмена, лимит и очистка не зависят от того, какой рендер их видит
    const controllers = useRef(new Map<number, AbortController>());
    const previews = useRef(new Map<number, string>());
    /** Файлы, которые займут место в списке (загружаются или уже загружены) — учитываются в лимите */
    const live = useRef(new Set<number>());
    const removed = useRef(new Set<number>());
    const mounted = useRef(false);

    const accept = onlyImages ? "image/*" : DOCUMENTS;
    const isImage = (media: UploadedMedia) => (media as { isImage?: boolean }).isImage ?? /\.(jpe?g|png|gif|webp|avif|svg)$/i.test(media.contentUrl ?? "");
    const images = items.filter(isImage);
    const busy = pending.some((item) => item.status !== "error");

    useEffect(() => {
        mounted.current = true;
        const running = controllers.current;
        const urls = previews.current;
        return () => {
            mounted.current = false;
            running.forEach((controller) => controller.abort());
            running.clear();
            urls.forEach((url) => URL.revokeObjectURL(url));
            urls.clear();
        };
    }, []);

    useEffect(() => {
        onBusyChange?.(busy);
    }, [busy, onBusyChange]);

    const setStatus = (keys: number[], status: Status) => setPending((prev) => prev.map((entry) => (keys.includes(entry.key) ? { ...entry, status } : entry)));
    /** Убрать превью из списка и освободить его адрес */
    const drop = (keys: number[]) => {
        for (const key of keys) {
            live.current.delete(key);
            const url = previews.current.get(key);
            if (url) URL.revokeObjectURL(url);
            previews.current.delete(key);
        }
        setPending((prev) => prev.filter((entry) => !keys.includes(entry.key)));
    };
    const cancel = (key: number) => {
        removed.current.add(key);
        controllers.current.get(key)?.abort();
        drop([key]);
    };

    const add = async (files: File[]) => {
        // При перетаскивании браузер accept не проверяет
        const accepted = files.filter((file) => matchesAccept(file, accept));
        if (accepted.length === 0) return;
        const slots = MAX_FILES - items.length - live.current.size;
        if (accepted.length > slots) onError(labels.tooMany);
        if (slots <= 0) return;
        const batch = accepted.slice(0, slots).map((file) => {
            const key = (counter.current += 1);
            const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;
            const tooBig = file.size > MAX_UPLOAD_BYTES;
            if (preview) previews.current.set(key, preview);
            if (!tooBig) live.current.add(key);
            return { key, file, tooBig, preview };
        });
        setPending((prev) => [...prev, ...batch.map(({ key, file, tooBig, preview }) => ({ key, name: file.name, preview, tooBig, status: tooBig ? "error" as const : "uploading" as const }))]);
        const results = await Promise.all(batch.map(async ({ key, file, tooBig }) => {
            if (tooBig) return null;
            const controller = new AbortController();
            controllers.current.set(key, controller);
            try {
                const media = await uploadMedia(file, token, controller.signal);
                if (controller.signal.aborted || removed.current.has(key)) return null;
                setStatus([key], "done");
                return { key, media };
            } catch {
                if (controller.signal.aborted || removed.current.has(key)) return null;
                live.current.delete(key);
                setStatus([key], "error");
                onError();
                return null;
            } finally {
                controllers.current.delete(key);
            }
        }));
        // Окно закрыли — загруженное никуда не передаём
        if (!mounted.current) return;
        // Крестик, нажатый у загруженного файла, пока догружались остальные, тоже исключает его
        const uploaded = results.filter((result): result is { key: number; media: UploadedMedia } => !!result && !removed.current.has(result.key));
        if (uploaded.length === 0) return;
        const keys = uploaded.map((result) => result.key);
        setStatus(keys, "saving");
        await onUpload(uploaded.map((result) => result.media)).catch(() => onError());
        drop(keys);
    };

    const cross = "absolute top-2.5 right-[5px] flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border-none bg-primary text-[13px] text-white disabled:cursor-wait";

    return (
        <div className="flex w-full flex-wrap gap-5">
            <label
                htmlFor={inputId}
                onDragOver={(event) => {
                    event.preventDefault();
                    setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(event) => {
                    event.preventDefault();
                    setDragging(false);
                    void add(Array.from(event.dataTransfer.files));
                }}
                // Поле файла скрыто визуально, но доступно с клавиатуры: Tab — на поле, рамка фокуса — у квадрата
                className={`relative flex h-[130px] w-[130px] cursor-pointer flex-col items-center justify-center gap-2.5 border border-dashed border-caption text-center text-[14px] transition-all duration-300 hover:opacity-80 has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-primary ${dragging ? "bg-primary text-white" : "bg-field text-caption"}`}
            >
                <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" className="fill-current"><path d="M14 6.667H7.333V0h-.666v6.667H0v.666h6.667V14h.666V7.333H14z" /></svg>
                <span>{dragging ? labels.drop : labels.add}</span>
                <input
                    id={inputId}
                    type="file"
                    multiple
                    accept={accept}
                    className="sr-only"
                    onChange={(event) => {
                        void add(Array.from(event.target.files ?? []));
                        event.target.value = "";
                    }}
                />
            </label>
            <div className="flex flex-wrap gap-2.5">
                {items.map((media) => {
                    const imageIndex = images.findIndex((image) => image.id === media.id);
                    return (
                    <div key={media.id} className="relative flex h-[130px] w-[130px] flex-col gap-1">
                        {isImage(media) ? (
                            <button type="button" aria-label={`${labels.gallery.photo} ${imageIndex + 1}`} onClick={() => setLightbox(imageIndex)} className="h-full w-full cursor-pointer">
                                {/* eslint-disable-next-line @next/next/no-img-element -- превью из хранилища */}
                                <img loading="lazy" decoding="async" src={mediaUrl(media, "medium")} alt="" className="inline-block h-full w-full object-cover" />
                            </button>
                        ) : (
                            <a href={mediaUrl(media)} download target="_blank" rel="noreferrer" className="flex h-full w-full items-center justify-center bg-accent-bg">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary">
                                    {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                                    <img src="/web/icons/offer/document.svg" alt="" />
                                </span>
                            </a>
                        )}
                        <button type="button" aria-label={labels.remove} disabled={removeDisabled} onClick={() => onDelete(media.id)} className={cross}>×</button>
                    </div>
                    );
                })}
                {pending.map((item) => (
                    <div key={item.key} className="relative flex h-[130px] w-[130px] flex-col gap-1">
                        {item.preview
                            // eslint-disable-next-line @next/next/no-img-element -- превью выбранного файла
                            ? <img loading="lazy" decoding="async" src={item.preview} alt={item.name} className="inline-block h-full w-full object-cover" />
                            : <div className="h-full w-full bg-accent-bg" />}
                        {item.status !== "saving" && <button type="button" aria-label={labels.remove} onClick={() => cancel(item.key)} className={cross}>×</button>}
                        {item.tooBig && <div className="mt-1 text-[12px] text-[red]">{labels.tooBig}</div>}
                        <div className="mt-[5px] h-1.5 overflow-hidden rounded-[4px] bg-[#ddd]">
                            <div className={`h-full transition-[width] duration-300 ${item.status === "error" ? "w-full bg-[red]" : item.status === "uploading" ? "w-1/2 bg-primary" : "w-full bg-primary"}`} />
                        </div>
                    </div>
                ))}
            </div>
            <GalleryLightbox
                images={images.map((media) => mediaUrl(media, "large") ?? "").filter(Boolean)}
                index={lightbox}
                onClose={() => setLightbox(null)}
                labels={labels.gallery}
            />
        </div>
    );
}
