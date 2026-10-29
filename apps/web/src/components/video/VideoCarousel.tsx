"use client";

import { useRef } from "react";

import { SwiperArrow } from "@/components/gallery/SwiperArrow";
import { useScrollEdges } from "@/components/gallery/useScrollEdges";

import { VideoEmbed } from "./VideoEmbed";

/**
 * Лента видео (VideoGallery старого фронта на Swiper): от 1024 px — три,
 * 768–1023 — два, уже — одно, отступ 10 px, высота 180 px, стрелки по краям.
 */
export function VideoCarousel({ videos, labels, className = "" }: {
    videos: string[];
    labels: { prev: string; next: string; video: string; unsupported: string };
    className?: string;
}) {
    const track = useRef<HTMLDivElement>(null);
    const edges = useScrollEdges(track);

    const go = (direction: 1 | -1) => {
        const node = track.current;
        const slide = node?.firstElementChild as HTMLElement | null;
        if (node && slide) node.scrollBy({ left: direction * (slide.offsetWidth + 10), behavior: "smooth" });
    };

    return (
        <div className={`relative px-[50px] down-sm:px-0 ${className}`}>
            <div className="relative">
                <div ref={track} className="@container flex snap-x snap-mandatory gap-2.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {videos.map((url, index) => (
                         
                        <div key={`${index}-${url}`} className="w-[100cqw] shrink-0 cursor-pointer snap-start min-[768px]:w-[calc((100cqw-10px)/2)] min-[1024px]:w-[calc((100cqw-20px)/3)]">
                            <VideoEmbed url={url} title={`${labels.video} ${index + 1}`} unsupported={labels.unsupported} />
                        </div>
                    ))}
                </div>
                <SwiperArrow direction="prev" label={labels.prev} disabled={edges.start} onClick={() => go(-1)} />
                <SwiperArrow direction="next" label={labels.next} disabled={edges.end} onClick={() => go(1)} />
            </div>
        </div>
    );
}
