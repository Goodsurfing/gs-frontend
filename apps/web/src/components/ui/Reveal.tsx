"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

// Как AOS в старом фронте: срабатывает, когда верх элемента поднялся на 120 px над низом окна
const OFFSET = 120;

/**
 * Появление при прокрутке (замена библиотеки AOS старого фронта: fade-up /
 * fade-down, 1 с, один раз). Без JS и при «уменьшении движения» — сразу видно.
 */
export function Reveal({ from, className = "", children }: {
    from: "up" | "down";
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

    const shift = from === "up" ? "translate-y-[100px]" : "-translate-y-[100px]";
    const motion = state === "hidden" ? `opacity-0 ${shift}` : "";
    const transition = state === "idle" ? "" : "transition-[opacity,translate] duration-1000 ease-in-out";

    return <div ref={ref} className={`${className} ${motion} ${transition}`}>{children}</div>;
}
