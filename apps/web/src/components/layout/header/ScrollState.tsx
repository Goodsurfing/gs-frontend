"use client";

import { useEffect } from "react";

/**
 * Ставит data-scrolled на <html>, когда страница прокручена больше чем на 20 px:
 * капсула шапки становится плотнее (как класс scrolled в старом фронте).
 */
export function ScrollState() {
    useEffect(() => {
        const update = () => document.documentElement.toggleAttribute("data-scrolled", window.scrollY > 20);
        update();
        window.addEventListener("scroll", update, { passive: true });
        return () => window.removeEventListener("scroll", update);
    }, []);

    return null;
}
