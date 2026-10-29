"use client";

import { type ReactNode, useEffect, useState } from "react";

const TOP_GAP = 300;

/**
 * Меню разделов под карточкой (Submenu + Anchor старого фронта: вакансия,
 * организация, волонтёр): прилипает под шапкой, подсвечивает раздел на
 * экране, кнопки появляются, когда карточка с кнопками уехала (прокрутка
 * > 500 px). До 992 px меню нет.
 */
export function SectionSubmenu({ items, children, className = "z-[4]" }: {
    items: { id: string; text: string }[];
    children: ReactNode;
    /** Слой: у вакансии 4, у организации 8 — как в старом фронте */
    className?: string;
}) {
    const [active, setActive] = useState<Record<string, boolean>>({});
    const [showButtons, setShowButtons] = useState(false);
    // Прилипает на 12 px ниже шапки сайта (её высота зависит от баннера и ширины)
    const [top, setTop] = useState<number | null>(null);

    useEffect(() => {
        const update = () => {
            setShowButtons(window.scrollY > 500);
            const header = document.querySelector("[data-site-header]")?.getBoundingClientRect();
            setTop(header ? Math.max(header.bottom, 0) + 12 : null);
            const next: Record<string, boolean> = {};
            for (const item of items) {
                const rect = document.getElementById(item.id)?.getBoundingClientRect();
                next[item.id] = !!rect && rect.top - TOP_GAP <= 100 && rect.bottom > 100;
            }
            setActive(next);
        };
        update();
        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        return () => {
            window.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
        };
    }, [items]);

    const go = (id: string) => {
        const element = document.getElementById(id);
        if (element) window.scrollTo({ top: element.offsetTop - TOP_GAP, behavior: "smooth" });
    };

    return (
        <nav
            style={top === null ? undefined : { top }}
            className={`sticky top-[calc(6.5rem+12px)] flex w-full items-center justify-between border-b border-caption bg-white px-2 py-[15px] down-lg:hidden down-md:flex-col down-md:gap-[30px] ${className}`}
        >
            <ul className="flex flex-wrap items-center justify-start gap-10">
                {items.map((item) => (
                    <li key={item.id} className="list-none">
                        <button
                            type="button"
                            onClick={() => go(item.id)}
                            aria-current={active[item.id] ? "location" : undefined}
                            className="cursor-pointer text-[16px] leading-[120%] text-primary transition-colors duration-300 hover:underline aria-[current=location]:text-black"
                        >
                            {item.text}
                        </button>
                    </li>
                ))}
            </ul>
            <div className={`flex items-center gap-[30px] transition-[opacity,visibility] ${showButtons ? "visible opacity-100 duration-500" : "invisible opacity-0 [transition:visibility_0s_0.5s,opacity_0.5s_linear]"}`}>
                {children}
            </div>
        </nav>
    );
}
