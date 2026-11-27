"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

// Как AOS в старом фронте: срабатывает, когда верх элемента поднялся на 120 px над низом окна
const OFFSET = 120;

/**
 * Появление при прокрутке (замена библиотеки AOS старого фронта: fade-up /
 * fade-down / zoom-in / zoom-out, 1 с, один раз). Без JS и при «уменьшении
 * движения» — сразу видно.
 */
const SHIFT = {
    up: "translate-y-[100px]",
    down: "-translate-y-[100px]",
    "zoom-in": "scale-[0.6]",
    "zoom-out": "scale-[1.2]",
} as const;

/** Тот же сдвиг уже 992 px (столбиком все шаги появляются одинаково — снизу) */
const SHIFT_PHONE = {
    up: "down-lg:translate-y-[100px]",
    down: "down-lg:-translate-y-[100px]",
    "zoom-in": "down-lg:scale-[0.6]",
    "zoom-out": "down-lg:scale-[1.2]",
} as const;

export function Reveal({ from, fromPhone, delay = "", className = "", children }: {
    from: keyof typeof SHIFT;
    fromPhone?: keyof typeof SHIFT_PHONE;
    /** Задержка появления (класс delay-*), чтобы элементы одного ряда появлялись по очереди */
    delay?: string;
    className?: string;
    children: ReactNode;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [state, setState] = useState<"idle" | "hidden" | "shown">("idle");

    useEffect(() => {
        const node = ref.current;
        if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        // Место элемента без сдвига появления: иначе сдвинутые вниз появлялись позже сдвинутых
        // вверх, и ряд «Как это работает» оживал через один (сдача тестировщицы 27.11.2026)
        const shiftY = () => {
            // Tailwind 4 сдвигает свойством translate («0px 100px»), не transform
            const [, y] = getComputedStyle(node).translate.split(" ");
            return Number.parseFloat(y ?? "") || 0;
        };
        const reached = () => node.getBoundingClientRect().top - shiftY() <= window.innerHeight - OFFSET;
        if (reached()) return;
        setState("hidden");
        const onScroll = () => {
            if (!reached()) return;
            setState("shown");
            window.removeEventListener("scroll", onScroll);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const motion = state === "hidden" ? `opacity-0 ${SHIFT[from]} ${fromPhone ? SHIFT_PHONE[fromPhone] : ""}` : "";
    const transition = state === "idle" ? "" : `transition-[opacity,translate,scale] duration-1000 ease-in-out ${delay}`;

    return <div ref={ref} className={`${className} ${motion} ${transition}`}>{children}</div>;
}
