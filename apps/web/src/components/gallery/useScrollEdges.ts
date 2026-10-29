"use client";

import { type RefObject, useCallback, useEffect, useState } from "react";

/** Упирается ли лента прокрутки в начало / конец — для неактивных стрелок. */
export function useScrollEdges(ref: RefObject<HTMLElement | null>) {
    const [edges, setEdges] = useState({ start: true, end: false });

    const update = useCallback(() => {
        const node = ref.current;
        if (!node) return;
        setEdges({
            start: node.scrollLeft <= 1,
            end: node.scrollLeft + node.clientWidth >= node.scrollWidth - 1,
        });
    }, [ref]);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;
        update();
        node.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        return () => {
            node.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
        };
    }, [ref, update]);

    return edges;
}
