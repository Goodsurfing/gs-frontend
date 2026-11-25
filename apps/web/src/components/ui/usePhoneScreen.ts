"use client";

import { useSyncExternalStore } from "react";

/** Как вариант down-md в globals.css: телефонная вёрстка кабинета (GS-291) */
const PHONE_QUERY = "(max-width: 768px)";

function subscribe(onChange: () => void) {
    const media = window.matchMedia(PHONE_QUERY);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
}

/**
 * Телефонная ли ширина. На сервере и при гидратации — null: показ решает CSS
 * (down-md), а хук нужен, чтобы компьютер не делал запросов телефонной версии.
 */
export function usePhoneScreen(): boolean | null {
    return useSyncExternalStore(subscribe, () => window.matchMedia(PHONE_QUERY).matches, () => null);
}
