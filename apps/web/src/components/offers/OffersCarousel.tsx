"use client";

import { Children, type ReactNode, useCallback, useRef } from "react";

/**
 * Лента карточек со стрелками (замена Swiper старого фронта): шире 992 px —
 * три карточки, 480–991 — две, уже — одна, между ними 10 px. Прокрутка
 * нативная (тач, тачпад, клавиатура), стрелки листают на одну карточку.
 */
export function OffersCarousel({ children, prevLabel, nextLabel, className = "" }: {
    children: ReactNode;
    prevLabel: string;
    nextLabel: string;
    className?: string;
}) {
    const track = useRef<HTMLDivElement>(null);

    const scroll = useCallback((direction: 1 | -1) => {
        const node = track.current;
        const slide = node?.firstElementChild as HTMLElement | null;
        if (!node || !slide) return;
        node.scrollBy({ left: direction * (slide.offsetWidth + 10), behavior: "smooth" });
    }, []);

    const arrow = (direction: 1 | -1, label: string) => (
        <button
            type="button"
            aria-label={label}
            onClick={() => scroll(direction)}
            // Высота 41 px, как у блока со строчной картинкой-стрелкой в старом фронте: по ней стрелка центрируется
            className={`absolute h-[41px] cursor-pointer self-center down-lg:hidden ${direction === 1 ? "right-0" : "left-0"}`}
        >
            <svg aria-hidden width="20" height="38" viewBox="0 0 20 38" fill="none" className={`block ${direction === 1 ? "rotate-180" : ""}`}>
                <path d="M2.59171 18.999L19.6847 1.83759C20.1051 1.41552 20.1051 0.738618 19.6847 0.316551C19.2643 -0.105517 18.5901 -0.105517 18.1697 0.316551L0.315289 18.2425C-0.105096 18.6645 -0.105096 19.3414 0.315289 19.7635L18.1697 37.6815C18.376 37.8885 18.6536 38 18.9233 38C19.1929 38 19.4706 37.8965 19.6768 37.6815C20.0972 37.2594 20.0972 36.5825 19.6768 36.1604L2.59171 18.999Z" fill="currentColor" className="text-caption" />
            </svg>
        </button>
    );

    return (
        <div className={`relative mt-[45px] flex w-full items-center ${className}`}>
            {arrow(-1, prevLabel)}
            <div className="w-full px-10 down-lg:px-5 down-sm:px-0">
                <div
                    ref={track}
                    className="@container flex snap-x snap-mandatory gap-2.5 overflow-x-auto [scrollbar-width:none] down-lg:px-10 down-lg:scroll-px-10 [&::-webkit-scrollbar]:hidden"
                >
                    {Children.map(children, (child) => (
                        // Ширина в cqw, а не в %: calc с процентами Chrome округляет по слагаемым (359,98 px вместо 360, как у Swiper)
                        <div className="w-[100cqw] shrink-0 snap-start min-[480px]:w-[calc((100cqw-10px)/2)] min-[992px]:w-[calc((100cqw-20px)/3)]">
                            {child}
                        </div>
                    ))}
                </div>
            </div>
            {arrow(1, nextLabel)}
        </div>
    );
}
