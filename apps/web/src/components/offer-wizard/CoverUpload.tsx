"use client";

import { type DragEvent, useId, useState } from "react";

import { mediaUrl } from "@/lib/media";
import { coverFileError, coverSizeError } from "@/lib/offerWizard";

import { imageSize, type UploadedImage, uploadImage } from "./media";

export interface CoverLabels {
    add: string;
    change: string;
    remove: string;
    widthHint: string;
    sizeHint: string;
    /** Тексты ошибок по ключам словаря offer (description.*) */
    errors: Record<string, string>;
    uploadError: string;
}

/**
 * Обложка вакансии (ImageUpload и ImageInput старого фронта): серое поле с
 * пунктиром и фотоаппаратом — щелчок или перетаскивание файла; загруженная
 * обложка — во всю ширину, поверх кнопки «Изменить» и «Удалить». Файл
 * проверяется до загрузки: png/jpg/webp, до 5 МБ, не меньше 1280×720.
 */
export function CoverUpload({ value, onChange, token, labels }: {
    value: UploadedImage | null;
    onChange: (value: UploadedImage | null) => void;
    token?: string;
    labels: CoverLabels;
}) {
    const id = useId();
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const take = async (file: File | undefined) => {
        if (!file) return;
        setError(null);
        const fileError = coverFileError(file.name, file.size);
        if (fileError) {
            setError(labels.errors[fileError] ?? fileError);
            return;
        }
        try {
            const size = await imageSize(file);
            const sizeError = coverSizeError(size.width, size.height);
            if (sizeError) {
                setError(labels.errors[sizeError] ?? sizeError);
                return;
            }
        } catch {
            setError(labels.uploadError);
            return;
        }
        setBusy(true);
        try {
            onChange(await uploadImage(file, token));
        } catch {
            setError(labels.uploadError);
        } finally {
            setBusy(false);
        }
    };

    const drop = (event: DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        void take(event.dataTransfer.files[0]);
    };

    const input = (
        <input
            id={id}
            type="file"
            accept="image/*"
            className="hidden"
            aria-label={labels.add}
            onChange={(event) => {
                void take(event.target.files?.[0]);
                event.target.value = "";
            }}
        />
    );

    const src = mediaUrl(value, "medium");
    return (
        <div className="h-full w-full">
            {src ? (
                <div className="relative max-w-full">
                    <div className={busy ? "opacity-50" : ""}>
                        {/* eslint-disable-next-line @next/next/no-img-element -- обложка из хранилища, размеры как в старом фронте */}
                        <img src={src} alt="" className="relative max-h-[270px] w-full overflow-hidden object-cover" />
                    </div>
                    {!busy && (
                        <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2.5">
                            <label htmlFor={id} className="flex h-[27px] max-w-[95px] cursor-pointer items-center rounded-[6px] border border-primary bg-white px-5 py-1.5 text-[12px] text-primary">
                                {labels.change}
                            </label>
                            {input}
                            <button type="button" onClick={() => onChange(null)} className="flex h-[27px] max-w-[95px] cursor-pointer items-center rounded-[6px] border border-primary bg-white px-5 py-1.5 text-[12px] text-primary">
                                {labels.remove}
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="box-border h-[216px] w-full">
                    <label
                        htmlFor={id}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={drop}
                        className={`relative box-content block h-full w-full cursor-pointer border border-dashed border-caption bg-field ${busy ? "opacity-50" : ""}`}
                    >
                        <span className="absolute top-1/2 left-1/2 flex h-full w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element -- значок */}
                            <img src="/web/icons/offer-wizard/photo-camera.svg" alt="" className="block max-w-10" />
                            <span className="mt-3.5 block text-[0.875rem] leading-[1.35] text-caption">{labels.add}</span>
                        </span>
                    </label>
                    {input}
                </div>
            )}
            <div className="flex flex-col">
                <span className="mt-2.5 font-[Lato] text-[0.625rem] font-normal text-caption">
                    {error && <span role="alert" className="my-[15px] block text-[0.75rem] text-[#d32f2f]">{error}</span>}
                    {labels.widthHint}
                    <br />
                    {labels.sizeHint}
                </span>
            </div>
        </div>
    );
}
