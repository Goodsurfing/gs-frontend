"use client";

import { type ReactNode, useCallback, useRef } from "react";

/**
 * Лента карточек событий (как «Сегодня получили достижения» у DonorSearch):
 * карточки в ряд, прокрутка нативная (палец, тачпад, клавиатура), шире 992 px —
 * стрелки листают на три карточки.
 */
export function EventFeedStrip({ children, prevLabel, nextLabel }: { children: ReactNode; prevLabel: string; nextLabel: string }) {
    const track = useRef<HTMLUListElement>(null);
    const scroll = useCallback((direction: 1 | -1) => {
        const node = track.current;
        const card = node?.firstElementChild as HTMLElement | null;
        if (!node || !card) return;
        node.scrollBy({ left: direction * 3 * (card.offsetWidth + 16), behavior: "smooth" });
    }, []);

    const arrow = (direction: 1 | -1, label: string) => (
        <button
            type="button"
            aria-label={label}
            onClick={() => scroll(direction)}
            className={`absolute top-1/2 z-[1] flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-accent-bg bg-white text-caption shadow-[0_2px_8px_rgba(14,29,39,0.12)] transition-colors hover:text-primary down-lg:hidden ${direction === 1 ? "-right-5" : "-left-5"}`}
        >
            <svg aria-hidden viewBox="0 0 24 24" className={`h-5 w-5 ${direction === 1 ? "" : "rotate-180"}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 6 6 6-6 6" /></svg>
        </button>
    );

    return (
        <div className="relative mt-8">
            {arrow(-1, prevLabel)}
            <ul ref={track} className="m-0 flex list-none snap-x snap-mandatory gap-4 overflow-x-auto p-0 pb-3 [scrollbar-width:none] down-md:px-5 down-md:scroll-px-5 [&::-webkit-scrollbar]:hidden">
                {children}
            </ul>
            {arrow(1, nextLabel)}
        </div>
    );
}
