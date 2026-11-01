"use client";

import { useId, useRef, useState } from "react";

import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import { mediaUrl } from "@/lib/media";
import { MAX_UPLOAD_BYTES, type UploadedMedia, uploadMedia } from "@/lib/mediaUpload";

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

interface Pending {
    key: number;
    name: string;
    preview: string | null;
    error: boolean;
    tooBig: boolean;
}

/**
 * Загрузка картинок и документов (ImagesUploader старого фронта): квадрат
 * «+ Добавить фото» 130×130 с пунктирной рамкой, перетаскивание файлов,
 * превью загруженных с крестиком. Больше 10 файлов и файлы больше 5 МБ не
 * загружаются; картинка открывается в просмотрщике, документ — по ссылке.
 */
export function ImagesUploader({ items, token, onUpload, onDelete, onError, onlyImages = true, labels }: {
    items: UploadedMedia[];
    token: string | undefined;
    onUpload: (media: UploadedMedia[]) => Promise<void>;
    onDelete: (id: string) => void;
    onError: (text?: string) => void;
    onlyImages?: boolean;
    labels: ImagesUploaderLabels;
}) {
    const inputId = useId();
    const input = useRef<HTMLInputElement>(null);
    const counter = useRef(0);
    const [pending, setPending] = useState<Pending[]>([]);
    const [dragging, setDragging] = useState(false);
    const [lightbox, setLightbox] = useState<number | null>(null);

    const isImage = (media: UploadedMedia) => (media as { isImage?: boolean }).isImage ?? /\.(jpe?g|png|gif|webp|avif|svg)$/i.test(media.contentUrl ?? "");
    const images = items.filter(isImage);

    const add = async (files: File[]) => {
        const slots = MAX_FILES - items.length;
        if (slots <= 0) {
            onError(labels.tooMany);
            return;
        }
        const accepted = files.filter((file) => !onlyImages || file.type.startsWith("image/")).slice(0, slots);
        const batch = accepted.map((file) => ({
            file,
            item: {
                key: (counter.current += 1),
                name: file.name,
                preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
                error: false,
                tooBig: file.size > MAX_UPLOAD_BYTES,
            },
        }));
        setPending((prev) => [...prev, ...batch.map(({ item }) => ({ ...item, error: item.tooBig }))]);
        const results = await Promise.all(batch.map(async ({ file, item }) => {
            if (item.tooBig) return null;
            try {
                const media = await uploadMedia(file, token);
                setPending((prev) => prev.filter((entry) => entry.key !== item.key));
                return media;
            } catch {
                setPending((prev) => prev.map((entry) => (entry.key === item.key ? { ...entry, error: true } : entry)));
                onError();
                return null;
            }
        }));
        const uploaded = results.filter((media): media is UploadedMedia => !!media);
        if (uploaded.length > 0) await onUpload(uploaded).catch(() => onError());
    };

    const cross = "absolute top-2.5 right-[5px] flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border-none bg-primary text-[13px] text-white";

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
                className={`flex h-[130px] w-[130px] cursor-pointer flex-col items-center justify-center gap-2.5 border border-dashed border-caption text-center text-[14px] transition-all duration-300 hover:opacity-80 ${dragging ? "bg-primary text-white" : "bg-field text-caption"}`}
            >
                <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" className="fill-current"><path d="M14 6.667H7.333V0h-.666v6.667H0v.666h6.667V14h.666V7.333H14z" /></svg>
                <span>{dragging ? labels.drop : labels.add}</span>
                <input
                    ref={input}
                    id={inputId}
                    type="file"
                    multiple
                    accept={onlyImages ? "image/*" : DOCUMENTS}
                    className="hidden"
                    onChange={(event) => {
                        void add(Array.from(event.target.files ?? []));
                        event.target.value = "";
                    }}
                />
            </label>
            <div className="flex flex-wrap gap-2.5">
                {items.map((media) => (
                    <div key={media.id} className="relative flex h-[130px] w-[130px] flex-col gap-1">
                        {isImage(media) ? (
                            <button type="button" onClick={() => setLightbox(images.findIndex((image) => image.id === media.id))} className="h-full w-full cursor-pointer">
                                {/* eslint-disable-next-line @next/next/no-img-element -- превью из хранилища */}
                                <img src={mediaUrl(media, "medium")} alt="" className="inline-block h-full w-full object-cover" />
                            </button>
                        ) : (
                            <a href={mediaUrl(media)} download target="_blank" rel="noreferrer" className="flex h-full w-full items-center justify-center bg-accent-bg">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary">
                                    {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                                    <img src="/web/icons/offer/document.svg" alt="" />
                                </span>
                            </a>
                        )}
                        <button type="button" aria-label={labels.remove} onClick={() => onDelete(media.id)} className={cross}>×</button>
                    </div>
                ))}
                {pending.map((item) => (
                    <div key={item.key} className="relative flex h-[130px] w-[130px] flex-col gap-1">
                        {item.preview
                            // eslint-disable-next-line @next/next/no-img-element -- превью выбранного файла
                            ? <img src={item.preview} alt={item.name} className="inline-block h-full w-full object-cover" />
                            : <div className="h-full w-full bg-accent-bg" />}
                        <button type="button" aria-label={labels.remove} onClick={() => setPending((prev) => prev.filter((entry) => entry.key !== item.key))} className={cross}>×</button>
                        {item.tooBig && <div className="mt-1 text-[12px] text-[red]">{labels.tooBig}</div>}
                        <div className="mt-[5px] h-1.5 overflow-hidden rounded-[4px] bg-[#ddd]">
                            <div className={`h-full transition-[width] duration-300 ${item.error ? "w-full bg-[red]" : "w-1/2 bg-primary"}`} />
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
