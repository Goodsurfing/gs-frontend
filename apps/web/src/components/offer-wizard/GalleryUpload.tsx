"use client";

import { type DragEvent, useId, useState } from "react";

import { ImageLightbox } from "@/components/ui/ImageLightbox";
import { mediaUrl } from "@/lib/media";
import { IMAGE_MAX_BYTES, MAX_GALLERY } from "@/lib/offerWizard";

import { type UploadedImage, uploadImage } from "./media";

export interface GalleryLabels {
    add: string;
    dropHere: string;
    tooMany: string;
    remove: string;
    close: string;
}

interface Pending { key: string; preview: string; failed: boolean }

/**
 * Фото вакансии (OfferGallery и ImagesUploader старого фронта): плитка
 * «Добавить фото» (щелчок или перетаскивание, несколько файлов), до десяти
 * снимков 130×130 с крестиком; щелчок по снимку открывает его крупно.
 * Каждое изменение сразу сохраняется — onChange получает новый список.
 */
export function GalleryUpload({ images, onChange, onError, token, labels }: {
    images: UploadedImage[];
    onChange: (images: UploadedImage[]) => Promise<void>;
    onError: (text?: string) => void;
    token?: string;
    labels: GalleryLabels;
}) {
    const id = useId();
    const [dragging, setDragging] = useState(false);
    const [pending, setPending] = useState<Pending[]>([]);

    const take = async (list: FileList | null) => {
        const files = Array.from(list ?? []);
        if (!files.length) return;
        const free = MAX_GALLERY - images.length;
        if (free <= 0) {
            onError(labels.tooMany);
            return;
        }
        const batch = files.slice(0, free).map((file, index) => ({ file, key: `${Date.now()}-${index}`, preview: URL.createObjectURL(file), failed: file.size > IMAGE_MAX_BYTES }));
        setPending((current) => [...current, ...batch.map(({ key, preview, failed }) => ({ key, preview, failed }))]);
        const results = await Promise.all(batch.map(async (item) => {
            if (item.failed) return null;
            try {
                const uploaded = await uploadImage(item.file, token);
                setPending((current) => current.filter((entry) => entry.key !== item.key));
                URL.revokeObjectURL(item.preview);
                return uploaded;
            } catch {
                setPending((current) => current.map((entry) => (entry.key === item.key ? { ...entry, failed: true } : entry)));
                return null;
            }
        }));
        const uploaded = results.filter((item): item is UploadedImage => item !== null);
        if (uploaded.length) await onChange([...images, ...uploaded]);
        if (uploaded.length < batch.length) onError();
    };

    const drop = (event: DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        setDragging(false);
        void take(event.dataTransfer.files);
    };

    return (
        <div className="flex w-full flex-wrap gap-5">
            <label
                htmlFor={id}
                onDragOver={(event) => {
                    event.preventDefault();
                    setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={drop}
                className={`flex h-[130px] w-[130px] cursor-pointer flex-col items-center justify-center gap-2.5 border border-dashed border-caption text-center text-[14px] transition-all duration-300 hover:opacity-80 ${dragging ? "bg-primary text-white" : "bg-field text-caption"}`}
            >
                <input id={id} type="file" accept="image/*" multiple className="hidden" onChange={(event) => {
                    void take(event.target.files);
                    event.target.value = "";
                }}
                />
                {/* Значок в строчной обёртке — высота строки, как у ReactSVG старого фронта */}
                <span className="block">
                    <svg aria-hidden viewBox="0 0 14 14" className={`h-3.5 w-3.5 ${dragging ? "fill-white" : "fill-caption"}`}><path d="M14 6.66667H7.33333V0H6.66667V6.66667H0V7.33333H6.66667V14H7.33333V7.33333H14V6.66667Z" /></svg>
                </span>
                <p>{dragging ? labels.dropHere : labels.add}</p>
            </label>
            <div className="flex flex-wrap gap-2.5">
                {images.map((image) => (
                    <div key={image.id} className="relative flex h-[130px] w-[130px] flex-col gap-1">
                        <ImageLightbox src={mediaUrl(image, "medium") ?? ""} alt={image.contentUrl} closeLabel={labels.close} className="h-full w-full [&_img]:h-full" />
                        <button
                            type="button"
                            aria-label={labels.remove}
                            onClick={() => void onChange(images.filter((item) => item.id !== image.id))}
                            className="absolute top-2.5 right-[5px] h-5 w-5 cursor-pointer rounded-full border-0 bg-primary text-white"
                        >
                            ×
                        </button>
                    </div>
                ))}
                {pending.map((item) => (
                    <div key={item.key} className="relative flex h-[130px] w-[130px] flex-col gap-1">
                        {/* eslint-disable-next-line @next/next/no-img-element -- превью загружаемого файла */}
                        <img src={item.preview} alt="" className="block h-full w-full object-cover opacity-50" />
                        <div className="mt-[5px] h-1.5 overflow-hidden rounded-[4px] bg-[#ddd]">
                            <div className={`h-full ${item.failed ? "w-full bg-[red]" : "w-1/2 bg-primary"}`} />
                        </div>
                        <button
                            type="button"
                            aria-label={labels.remove}
                            onClick={() => {
                                URL.revokeObjectURL(item.preview);
                                setPending((current) => current.filter((entry) => entry.key !== item.key));
                            }}
                            className="absolute top-2.5 right-[5px] h-5 w-5 cursor-pointer rounded-full border-0 bg-primary text-white"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
