"use client";

import { useRef, useState } from "react";

export interface UploaderPhoto { key: string; src: string }
export interface PendingPhoto { key: string; preview: string; error?: string; failed?: boolean }

const plus = (
    <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
        <path d="M14 6.66667H7.33333V0H6.66667V6.66667H0V7.33333H6.66667V14H7.33333V7.33333H14V6.66667Z" />
    </svg>
);

/**
 * Загрузка фото (shared/ui/ImagesUploader старого фронта): плитка «Добавить
 * фото» (клик или перетаскивание файлов), рядом — загруженные фото 130×130 с
 * «×» и файлы в загрузке с полосой. Плитки — один блок: пока помещаются в
 * строку, стоят справа от кнопки, иначе уходят под неё.
 */
export function PhotoUploader({ photos, pending, onFiles, onRemove, onCancel, onOpen, labels }: {
    photos: UploaderPhoto[];
    pending: PendingPhoto[];
    onFiles: (files: File[]) => void;
    onRemove: (key: string) => void;
    onCancel: (key: string) => void;
    onOpen?: (index: number) => void;
    labels: { add: string; drop: string; remove: string; photo: string };
}) {
    const input = useRef<HTMLInputElement>(null);
    const [over, setOver] = useState(false);
    const take = (list: FileList | null) => onFiles([...(list ?? [])].filter((file) => file.type.startsWith("image/")));
    const remove = "absolute top-2.5 right-[5px] flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border-0 bg-primary text-white";
    return (
        <div className="flex w-full flex-wrap gap-5">
            <button
                type="button"
                onClick={() => input.current?.click()}
                onDragOver={(event) => { event.preventDefault(); setOver(true); }}
                onDragLeave={() => setOver(false)}
                onDrop={(event) => { event.preventDefault(); setOver(false); take(event.dataTransfer.files); }}
                className={`flex h-[130px] w-[130px] cursor-pointer flex-col items-center justify-center gap-2.5 border border-dashed border-caption text-center text-[14px] transition-all duration-300 hover:opacity-80 ${over ? "bg-primary text-white" : "bg-field text-caption"}`}
            >
                {plus}
                <p>{over ? labels.drop : labels.add}</p>
            </button>
            <input ref={input} type="file" accept="image/*" multiple hidden onChange={(event) => { take(event.target.files); event.target.value = ""; }} />
            {(photos.length > 0 || pending.length > 0) && (
                <div className="flex flex-wrap gap-2.5">
                    {photos.map((photo, index) => (
                        <div key={photo.key} className="relative flex h-[130px] w-[130px] flex-col gap-1">
                            {/* eslint-disable-next-line @next/next/no-img-element -- фото из хранилища */}
                            <img loading="eager" src={photo.src} alt={`${labels.photo} ${index + 1}`} onClick={() => onOpen?.(index)} className="h-full w-full cursor-pointer object-cover" />
                            <button type="button" aria-label={labels.remove} onClick={() => onRemove(photo.key)} className={remove}>×</button>
                        </div>
                    ))}
                    {pending.map((item) => (
                        <div key={item.key} className="relative flex h-[130px] w-[130px] flex-col gap-1">
                            {/* eslint-disable-next-line @next/next/no-img-element -- превью выбранного файла */}
                            <img loading="lazy" decoding="async" src={item.preview} alt="" className="h-full w-full object-cover" />
                            <button type="button" aria-label={labels.remove} onClick={() => onCancel(item.key)} className={remove}>×</button>
                            {item.error && <div className="mt-1 text-[12px] text-[red]">{item.error}</div>}
                            <div className="mt-[5px] h-1.5 overflow-hidden rounded-[4px] bg-[#ddd]">
                                <div className={`h-full transition-[width] duration-300 ${item.failed || item.error ? "w-full bg-[red]" : "w-1/2 bg-primary"}`} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
