"use client";

import { useRef } from "react";

import { useScrollEdges } from "@/components/gallery/useScrollEdges";

export interface NewsItem { id: string; title: string; date: string; image?: string; href: string }

/**
 * «Новое из Сообщества» (CommunityNewsContainer старого фронта): свежие
 * статьи блога лентой — шире 1100 px три, 992–1099 две, уже одна; серые
 * стрелки по бокам, при наведении — синие.
 */
export function CommunityNews({ items, labels }: { items: NewsItem[]; labels: { prev: string; next: string } }) {
    const track = useRef<HTMLDivElement>(null);
    const edges = useScrollEdges(track);
    const go = (direction: 1 | -1) => {
        const node = track.current;
        const slide = node?.firstElementChild as HTMLElement | null;
        if (node && slide) node.scrollBy({ left: direction * (slide.offsetWidth + 10), behavior: "smooth" });
    };
    const arrow = (direction: 1 | -1) => (
        <button
            type="button"
            aria-label={direction === -1 ? labels.prev : labels.next}
            disabled={direction === -1 ? edges.start : edges.end}
            onClick={() => go(direction)}
            className="group mb-[100px] cursor-pointer down-md:hidden"
        >
            <span
                aria-hidden
                className={`block h-[38px] w-5 bg-caption transition-colors duration-300 group-hover:bg-primary ${direction === 1 ? "rotate-180" : ""}`}
                style={{ maskImage: "url(/web/images/home/slider-arrow.svg)", WebkitMaskImage: "url(/web/images/home/slider-arrow.svg)", maskSize: "contain", maskRepeat: "no-repeat", maskPosition: "center" }}
            />
        </button>
    );
    return (
        <div className="flex w-full items-center justify-between">
            {arrow(-1)}
            <div ref={track} className="@container flex w-full max-w-[90%] min-w-0 snap-x snap-mandatory gap-2.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {items.map((item) => (
                    // Слайд — доля ленты, карточка в нём — не шире 320 px (как у Swiper)
                    <div key={item.id} className="w-[100cqw] shrink-0 snap-start min-[992px]:w-[calc((100cqw-10px)/2)] min-[1100px]:w-[calc((100cqw-20px)/3)]">
                    <a
                        href={item.href}
                        className="group flex max-w-[320px] cursor-pointer flex-col items-start"
                    >
                        {item.image
                            // eslint-disable-next-line @next/next/no-img-element -- обложка статьи
                            ? <img src={item.image} alt={item.title} loading="lazy" className="h-[248px] w-full object-cover" />
                            : <div className="h-[248px] w-full bg-field" />}
                        <p className="mt-[17px] mb-[5px] text-[0.875rem] leading-[143%] text-ink-secondary opacity-50">{item.date}</p>
                        <h3 title={item.title} className="w-full truncate text-[1.125rem] text-ink-secondary transition-all duration-300 group-hover:text-primary">{item.title}</h3>
                    </a>
                    </div>
                ))}
            </div>
            {arrow(1)}
        </div>
    );
}
