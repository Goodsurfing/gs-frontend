"use client";

import { useRef, useState } from "react";

import { GalleryLightbox } from "./GalleryLightbox";
import { SwiperArrow } from "./SwiperArrow";
import { useScrollEdges } from "./useScrollEdges";

/**
 * Лента фото (как ImageGallerySlider старого фронта на Swiper): от 1024 px —
 * три фото, 768–1023 — два, уже — одно, отступ 10 px; по клику — просмотр
 * во весь экран. Стрелки — в стиле Swiper, поверх крайних фото.
 */
export function GalleryCarousel({ images, labels, className = "" }: {
    images: string[];
    labels: { open: string; close: string; prev: string; next: string; photo: string };
    className?: string;
}) {
    const track = useRef<HTMLDivElement>(null);
    const edges = useScrollEdges(track);
    const [open, setOpen] = useState<number | null>(null);

    const go = (direction: 1 | -1) => {
        const node = track.current;
        const slide = node?.firstElementChild as HTMLElement | null;
        if (node && slide) node.scrollBy({ left: direction * (slide.offsetWidth + 10), behavior: "smooth" });
    };

    return (
        <div className={`relative px-[50px] down-sm:px-0 ${className}`}>
            <div className="relative">
                {/* Ширина в cqw: calc с процентами Chrome округляет по слагаемым (см. OffersCarousel) */}
                <div ref={track} className="@container flex snap-x snap-mandatory items-center gap-2.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {images.map((src, index) => (
                        <button
                            // Фото в галерее бывают повторами (перенос со старого сайта) — ключ с позицией
                            key={`${index}-${src}`}
                            type="button"
                            aria-label={`${labels.open} ${index + 1}`}
                            onClick={() => setOpen(index)}
                            className="w-[100cqw] shrink-0 cursor-pointer snap-start min-[768px]:w-[calc((100cqw-10px)/2)] min-[1024px]:w-[calc((100cqw-20px)/3)]"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element -- фото из хранилища; строчная картинка, как в старом фронте (+3 px под базовой линией) */}
                            <img src={src} alt="" loading="lazy" className="h-[180px] w-full object-cover" />
                        </button>
                    ))}
                </div>
                <SwiperArrow direction="prev" label={labels.prev} disabled={edges.start} onClick={() => go(-1)} />
                <SwiperArrow direction="next" label={labels.next} disabled={edges.end} onClick={() => go(1)} />
            </div>
            <GalleryLightbox images={images} index={open} onClose={() => setOpen(null)} labels={labels} />
        </div>
    );
}
