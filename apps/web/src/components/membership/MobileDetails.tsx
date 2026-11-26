"use client";

import { useEffect, useId, useRef, useState } from "react";

/**
 * Блок «Подробнее» страницы членства (GS-333): на телефоне (до 768 px) свёрнут
 * в строку-кнопку, на компьютере — как раньше, раскрыт и без кнопки. Содержимое
 * в разметке всегда (поисковикам и ссылкам-якорям), на телефоне только скрыто.
 * Переход по якорю внутрь блока (#tariffs, #support…) раскрывает его.
 */
export function MobileDetails({ title, children }: { title: string; children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const contentId = useId();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const openForHash = () => {
            const id = decodeURIComponent(window.location.hash.slice(1));
            if (!id || !ref.current) return;
            const target = document.getElementById(id);
            if (target && ref.current.contains(target)) {
                setOpen(true);
                // Блок только что раскрылся — прокрутить к цели уже после отрисовки
                requestAnimationFrame(() => target.scrollIntoView());
            }
        };
        openForHash();
        window.addEventListener("hashchange", openForHash);
        return () => window.removeEventListener("hashchange", openForHash);
    }, []);

    return (
        <div ref={ref} className="down-md:border-b down-md:border-[#e0e0e0]">
            <button
                type="button"
                aria-expanded={open}
                aria-controls={contentId}
                onClick={() => setOpen((value) => !value)}
                className="hidden w-full cursor-pointer items-center justify-between gap-3 bg-white px-5 py-4 text-left text-[1.0625rem] leading-[1.35] font-semibold text-[#1a1a1a] down-md:flex"
            >
                <span>{title}</span>
                <span aria-hidden className={`shrink-0 text-[1.25rem] leading-none text-primary transition-transform duration-200 ${open ? "rotate-45" : ""}`}>+</span>
            </button>
            <div id={contentId} className={open ? "" : "down-md:hidden"}>{children}</div>
        </div>
    );
}
