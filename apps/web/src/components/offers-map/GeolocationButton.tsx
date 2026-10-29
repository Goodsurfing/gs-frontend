"use client";

import { useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any -- нетипизированное API Яндекс.Карт 2.1 */

// Масштаб «город целиком», а не двор — как в старом фронте
const CITY_ZOOM = 11;

/** «Показать моё местоположение»: круглая кнопка в правом нижнем углу карты. */
export function GeolocationButton({ map, label, errorLabel }: { map: any; label: string; errorLabel: string }) {
    const [locating, setLocating] = useState(false);
    const [failed, setFailed] = useState(false);

    const locate = () => {
        if (!map || !navigator.geolocation) {
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
        <button
            type="button"
            onClick={locate}
            aria-label={label}
            title={failed ? errorLabel : label}
            className="absolute right-2.5 bottom-6 z-[15] flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white shadow-[0_4px_8px_rgba(0,0,0,0.2)]"
        >
            <svg aria-hidden viewBox="0 0 24 24" className={`h-5 w-5 fill-caption ${locating ? "animate-pulse" : ""}`}>
                <path d="M12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12C16 9.79 14.21 8 12 8ZM20.94 11C20.48 6.83 17.17 3.52 13 3.06V1H11V3.06C6.83 3.52 3.52 6.83 3.06 11H1V13H3.06C3.52 17.17 6.83 20.48 11 20.94V23H13V20.94C17.17 20.48 20.48 17.17 20.94 13H23V11H20.94ZM12 19C8.13 19 5 15.87 5 12C5 8.13 8.13 5 12 5C15.87 5 19 8.13 19 12C19 15.87 15.87 19 12 19Z" />
            </svg>
        </button>
    );
}
