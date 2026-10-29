"use client";

import { useEffect, useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any -- нетипизированное API Яндекс.Карт 2.1 */

// Масштаб «город целиком» при переходе к своему местоположению
const CITY_ZOOM = 11;
const BUTTON = "flex h-10 w-10 cursor-pointer items-center justify-center bg-white text-ink transition-colors hover:bg-field disabled:cursor-default disabled:text-caption disabled:hover:bg-white";

/**
 * Кнопки карты в одном стиле: приблизить / отдалить (вместо ползунка Яндекса)
 * и «моё местоположение». Справа внизу, крупные области нажатия.
 */
export function MapControls({ map, maxZoom, labels }: {
    map: any;
    maxZoom: number;
    labels: { zoomIn: string; zoomOut: string; locate: string; locateError: string };
}) {
    const [zoom, setZoom] = useState<number>(() => map.getZoom());
    const [locating, setLocating] = useState(false);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        const update = () => setZoom(map.getZoom());
        map.events.add("boundschange", update);
        return () => map.events.remove("boundschange", update);
    }, [map]);

    const zoomBy = (delta: number) => map.setZoom(map.getZoom() + delta, { duration: 200, checkZoomRange: true });

    const locate = () => {
        if (!navigator.geolocation) {
            setFailed(true);
            return;
        }
        setFailed(false);
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocating(false);
                map.setCenter([position.coords.latitude, position.coords.longitude], CITY_ZOOM, { duration: 400 });
            },
            () => {
                setLocating(false);
                setFailed(true);
            },
            { enableHighAccuracy: false, timeout: 10_000, maximumAge: 60_000 },
        );
    };

    return (
        <div className="absolute right-3 bottom-6 z-[15] flex flex-col items-center gap-3">
            <div className="flex flex-col overflow-hidden rounded-[12px] shadow-[0_4px_12px_rgba(14,29,39,0.18)]">
                <button type="button" aria-label={labels.zoomIn} onClick={() => zoomBy(1)} disabled={zoom >= maxZoom} className={`${BUTTON} border-b border-field`}>
                    <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                </button>
                <button type="button" aria-label={labels.zoomOut} onClick={() => zoomBy(-1)} disabled={zoom <= 2} className={BUTTON}>
                    <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2" strokeLinecap="round"><path d="M5 12h14" /></svg>
                </button>
            </div>
            <button
                type="button"
                onClick={locate}
                aria-label={labels.locate}
                title={failed ? labels.locateError : labels.locate}
                className={`${BUTTON} rounded-full shadow-[0_4px_12px_rgba(14,29,39,0.18)]`}
            >
                <svg aria-hidden viewBox="0 0 24 24" className={`h-5 w-5 fill-current ${failed ? "text-error" : "text-primary"} ${locating ? "animate-pulse" : ""}`}>
                    <path d="M12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12C16 9.79 14.21 8 12 8ZM20.94 11C20.48 6.83 17.17 3.52 13 3.06V1H11V3.06C6.83 3.52 3.52 6.83 3.06 11H1V13H3.06C3.52 17.17 6.83 20.48 11 20.94V23H13V20.94C17.17 20.48 20.48 17.17 20.94 13H23V11H20.94ZM12 19C8.13 19 5 15.87 5 12C5 8.13 8.13 5 12 5C15.87 5 19 8.13 19 12C19 15.87 15.87 19 12 19Z" />
                </svg>
            </button>
        </div>
    );
}
