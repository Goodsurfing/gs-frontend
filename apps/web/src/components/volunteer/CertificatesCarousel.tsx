"use client";

import { useRef } from "react";

import { SwiperArrow } from "@/components/gallery/SwiperArrow";
import { useScrollEdges } from "@/components/gallery/useScrollEdges";
import { MaskIcon } from "@/components/offer/parts";

/**
 * Сертификаты волонтёра лентой файлов (VolunteerCertificatesCard старого
 * фронта на Swiper): серые плитки 130 px с иконкой документа, по клику
 * файл скачивается. В ряд — 6 (от 1000 px), 5, 4, 3, 2, 1 на узких экранах.
 */
export function CertificatesCarousel({ files, labels }: { files: string[]; labels: { prev: string; next: string; file: string } }) {
    const track = useRef<HTMLDivElement>(null);
    const edges = useScrollEdges(track);
    const go = (direction: 1 | -1) => {
        const node = track.current;
        const slide = node?.firstElementChild as HTMLElement | null;
        if (node && slide) node.scrollBy({ left: direction * (slide.offsetWidth + 10), behavior: "smooth" });
    };
    return (
        <div className="relative px-[50px] down-sm:px-0">
            <div ref={track} className="@container flex snap-x snap-mandatory items-center gap-2.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {files.map((url, index) => (
                    <a
                         
                        key={`${index}-${url}`}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        download
                        aria-label={`${labels.file} ${index + 1}`}
                        className="flex h-[130px] w-[100cqw] shrink-0 snap-start items-center justify-center bg-accent-bg min-[400px]:w-[calc((100cqw-10px)/2)] min-[576px]:w-[calc((100cqw-20px)/3)] min-[640px]:w-[calc((100cqw-30px)/4)] min-[768px]:w-[calc((100cqw-40px)/5)] min-[1000px]:w-[calc((100cqw-50px)/6)]"
                    >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary">
                            {/* Цвет как у старого фронта: общий стиль svg там красил иконки в --bg-field */}
                            <MaskIcon name="document" className="h-5 w-5 text-field" />
                        </span>
                    </a>
                ))}
            </div>
            <SwiperArrow direction="prev" label={labels.prev} disabled={edges.start} onClick={() => go(-1)} />
            <SwiperArrow direction="next" label={labels.next} disabled={edges.end} onClick={() => go(1)} />
        </div>
    );
}
