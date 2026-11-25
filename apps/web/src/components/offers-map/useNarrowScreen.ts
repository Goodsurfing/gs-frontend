"use client";

import { useSyncExternalStore } from "react";

/** Как вариант down-lg в globals.css: на таких экранах каталог — вкладками «Список / Карта / Фильтр» */
const NARROW_QUERY = "(max-width: 992px)";

function subscribe(onChange: () => void) {
    const media = window.matchMedia(NARROW_QUERY);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
}

/**
 * Узкий ли экран. На сервере и при гидратации — null (ширина неизвестна):
 * тяжёлое (Яндекс.Карты) до ответа не монтируем, чтобы телефон его не грузил.
 */
export function useNarrowScreen(): boolean | null {
    return useSyncExternalStore(subscribe, () => window.matchMedia(NARROW_QUERY).matches, () => null);
}
