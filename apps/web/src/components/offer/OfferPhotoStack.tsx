"use client";

import { useState } from "react";

import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";

/**
 * Стопка из четырёх фото в карточке вакансии с надписью «Фотографии»
 * (OfferPersonalCardImageBlock): при наведении фото раздвигаются, по клику —
 * просмотр во весь экран.
 */
export function OfferPhotoStack({ images, labels }: {
    images: string[];
    labels: { photos: string; close: string; prev: string; next: string; photo: string };
}) {
    const [open, setOpen] = useState<number | null>(null);
    if (images.length === 0) return null;
    const shift = ["left-0 z-[4]", "left-6 z-[3] group-hover:translate-x-[15px]", "left-12 z-[2] group-hover:translate-x-[30px]", "left-[70px] z-[1] group-hover:translate-x-[45px]"];

    return (
        <>
            <button type="button" onClick={() => setOpen(0)} className="group relative isolate h-[130px] w-[130px] cursor-pointer" aria-label={labels.photos}>
                <span className="absolute top-[60px] left-1/2 z-[5] flex -translate-x-1/2 flex-col justify-center gap-7 text-white">
                    {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                    <img src="/web/icons/offer/dots.svg" alt="" className="mx-auto h-1.5 w-[34px]" />
                    <span className="mx-auto text-[14px] leading-[120%] font-medium whitespace-nowrap">{labels.photos}</span>
                </span>
                {images.slice(0, 4).map((src, index) => (
                    // eslint-disable-next-line @next/next/no-img-element -- превью из хранилища
                    <img
                        key={`${index}-${src}`}
                        src={src}
                        alt=""
                        className={`absolute top-0 h-[130px] w-[130px] border border-white object-cover transition-all duration-200 ease-in ${shift[index]}`}
                    />
                ))}
            </button>
            <GalleryLightbox images={images} index={open} onClose={() => setOpen(null)} labels={labels} />
        </>
    );
}
