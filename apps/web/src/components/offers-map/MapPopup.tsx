"use client";

import { useEffect, useRef, useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any -- нетипизированное API Яндекс.Карт 2.1 */

export interface PopupOffer {
    id: number;
    name: string;
    href: string;
    image?: string;
    category?: { name: string; color: string };
}

export type MapPopupContent =
    | { kind: "offer"; offer: PopupOffer }
    | { kind: "cluster"; offers: PopupOffer[] };

const WIDTH = { offer: 220, cluster: 280 };
const EDGE = 16;
// Зазор от точки на карте до карточки: половина кластера (20) и хвостик
const GAP = 26;
// Если над точкой меньше места — открываем вниз
const MIN_TOP_SPACE = 260;
const TAIL_MAX_SHIFT = 20;

interface Position { left: number; top: number; tail: number; placement: "top" | "bottom" }

/** Экранная позиция карточки из географических координат точки; у края карты — сдвиг внутрь. */
function popupPosition(map: any, container: HTMLElement | null, coords: [number, number], width: number): Position | null {
    if (!map || !container) return null;
    try {
        const global = map.options.get("projection").toGlobalPixels(coords, map.getZoom());
        const [pageX, pageY] = map.converter.globalToPage(global);
        const rect = container.getBoundingClientRect();
        const x = pageX - (rect.left + window.scrollX);
        const y = pageY - (rect.top + window.scrollY);
        const half = width / 2;
        const left = Math.min(Math.max(x, half + EDGE), Math.max(half + EDGE, rect.width - half - EDGE));
        const placement = y < MIN_TOP_SPACE ? "bottom" : "top";
        return {
            left,
            top: placement === "top" ? y - GAP : y + GAP,
            tail: Math.min(Math.max(x - left, -TAIL_MAX_SHIFT), TAIL_MAX_SHIFT),
            placement,
        };
    } catch {
        return null;
    }
}

/**
 * Карточка на карте с хвостиком к точке. Положение считается из географических
 * координат на каждый кадр движения карты — карточка «приклеена» к отметке и
 * при перетаскивании, и при зуме. У края карты сдвигается внутрь, хвостик —
 * к точке.
 */
export function MapPopup({ map, container, coords, content, labels, onClose }: {
    map: any;
    container: HTMLElement | null;
    coords: [number, number];
    content: MapPopupContent;
    labels: { more: string; clusterTitle: string; close: string };
    onClose: () => void;
}) {
    // Перерисовка на каждый кадр движения карты (actiontick) — карточка «приклеена» к точке
    const [, setFrame] = useState(0);
    const closeRef = useRef<HTMLButtonElement>(null);
    const width = WIDTH[content.kind];

    useEffect(() => {
        if (!map) return;
        const redraw = () => setFrame((frame) => frame + 1);
        map.events.add(["actiontick", "actionend", "sizechange"], redraw);
        return () => map.events.remove(["actiontick", "actionend", "sizechange"], redraw);
    }, [map]);

    useEffect(() => {
        closeRef.current?.focus({ preventScroll: true });
    }, [content]);

    const position = popupPosition(map, container, coords, width);
    if (!position) return null;

    return (
        <div
            role="dialog"
            aria-label={content.kind === "offer" ? content.offer.name : labels.clusterTitle}
            style={{ left: position.left, top: position.top, width }}
            className={`absolute z-30 flex max-w-[calc(100vw-32px)] flex-col rounded-[12px] bg-white shadow-[0_8px_24px_rgba(33,33,33,0.16)] ${position.placement === "top" ? "-translate-x-1/2 -translate-y-full" : "-translate-x-1/2"} ${content.kind === "cluster" ? "max-h-[min(70vh,420px)] p-4" : ""}`}
        >
            <button
                ref={closeRef}
                type="button"
                aria-label={labels.close}
                onClick={onClose}
                className="absolute top-2 right-2 z-10 flex h-[22px] w-[22px] cursor-pointer items-center justify-center rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.35)]"
            >
                <svg aria-hidden width="10" height="10" viewBox="0 0 14 14" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" /></svg>
            </button>

            {content.kind === "offer" ? (
                <div className="flex flex-col overflow-hidden rounded-[12px]">
                    <a href={content.offer.href} className="block leading-none" tabIndex={-1}>
                        {/* eslint-disable-next-line @next/next/no-img-element -- превью из хранилища */}
                        <img src={content.offer.image ?? "/web/images/default-offer.png"} alt="" className="block h-[120px] w-full object-cover" />
                    </a>
                    <div className="flex flex-col gap-1 overflow-hidden px-3 pt-2.5 pb-3">
                        <div className="line-clamp-2 text-[14px] font-bold">{content.offer.name}</div>
                        {content.offer.category && (
                            <div className="text-[12px] font-bold" style={{ color: content.offer.category.color }}>{content.offer.category.name}</div>
                        )}
                        <a href={content.offer.href} className="text-primary transition-all hover:underline">{labels.more}</a>
                    </div>
                </div>
            ) : (
                <>
                    <h3 className="mb-3 pr-6 text-[16px] font-bold">{labels.clusterTitle}</h3>
                    <ul className="flex flex-col gap-2 overflow-y-auto">
                        {content.offers.map((offer) => (
                            <li key={offer.id} className="rounded-[8px] transition-colors hover:bg-black/4">
                                <a href={offer.href} className="flex items-center gap-2.5 p-1.5 text-primary">
                                    {/* eslint-disable-next-line @next/next/no-img-element -- превью из хранилища */}
                                    <img src={offer.image ?? "/web/images/default-offer.png"} alt="" className="h-11 w-11 shrink-0 rounded-[8px] object-cover" />
                                    <span className="flex min-w-0 flex-col gap-0.5">
                                        <span className="line-clamp-2 text-[14px] font-semibold">{offer.name}</span>
                                        {offer.category && <span className="text-[12px] font-bold" style={{ color: offer.category.color }}>{offer.category.name}</span>}
                                    </span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </>
            )}

            <span
                aria-hidden
                style={{ left: `calc(50% + ${position.tail}px)` }}
                className={`absolute h-4 w-4 -translate-x-1/2 rotate-45 bg-white ${position.placement === "top" ? "-bottom-2 shadow-[4px_4px_6px_-2px_rgba(33,33,33,0.1)]" : "-top-2 shadow-[-4px_-4px_6px_-2px_rgba(33,33,33,0.1)]"}`}
            />
        </div>
    );
}
