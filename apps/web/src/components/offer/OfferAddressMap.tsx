"use client";

import { useEffect, useRef } from "react";

import { loadYmaps, type Ymaps } from "@/components/offers-map/yandexMaps";

/**
 * Карта с меткой места вакансии (OfferAddressCard старого фронта: Яндекс.Карты,
 * масштаб 10, стандартная метка). Не загрузилась — остаётся пустая плашка.
 */
export function OfferAddressMap({ latitude, longitude, locale }: { latitude: number; longitude: number; locale: string }) {
    const node = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let map: Ymaps | null = null;
        let cancelled = false;
        loadYmaps(locale)
            .then((ymaps) => {
                if (cancelled || !node.current) return;
                map = new ymaps.Map(node.current, { center: [latitude, longitude], zoom: 10, controls: [] });
                map.geoObjects.add(new ymaps.Placemark([latitude, longitude]));
            })
            .catch(() => undefined);
        return () => {
            cancelled = true;
            map?.destroy();
        };
    }, [latitude, longitude, locale]);

    return <div ref={node} className="mt-5 block h-[180px] w-full" />;
}
