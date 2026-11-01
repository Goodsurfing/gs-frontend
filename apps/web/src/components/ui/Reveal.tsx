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

export function Reveal({ from, className = "", children }: {
    from: keyof typeof SHIFT;
    className?: string;
    children: ReactNode;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [state, setState] = useState<"idle" | "hidden" | "shown">("idle");

    useEffect(() => {
        const node = ref.current;
        if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const reached = () => node.getBoundingClientRect().top <= window.innerHeight - OFFSET;
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

    const motion = state === "hidden" ? `opacity-0 ${SHIFT[from]}` : "";
    const transition = state === "idle" ? "" : "transition-[opacity,translate,scale] duration-1000 ease-in-out";

    return <div ref={ref} className={`${className} ${motion} ${transition}`}>{children}</div>;
}
