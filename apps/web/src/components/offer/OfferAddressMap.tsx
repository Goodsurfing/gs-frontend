"use client";

import { useEffect, useRef, useState } from "react";

import { loadYmaps, type Ymaps } from "@/components/offers-map/yandexMaps";

/**
 * Карта с меткой места вакансии (OfferAddressCard старого фронта: Яндекс.Карты,
 * масштаб 10, стандартная метка). Скрипты Яндекс.Карт весят ~3 МБ, а карта —
 * внизу страницы: грузим их, только когда до карты долистали (за 300 px до неё).
 * Иначе на медленном мобильном интернете страница вакансии открывалась 30 с
 * вместо 12. Не загрузилась — остаётся пустая плашка.
 */
export function OfferAddressMap({ latitude, longitude, locale }: { latitude: number; longitude: number; locale: string }) {
    const node = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const element = node.current;
        if (!element || visible) return;
        if (typeof IntersectionObserver === "undefined") {
            // Старый браузер без наблюдателя — как раньше, сразу
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setVisible(true);
            return;
        }
        const observer = new IntersectionObserver((entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
                setVisible(true);
                observer.disconnect();
            }
        }, { rootMargin: "300px 0px" });
        observer.observe(element);
        return () => observer.disconnect();
    }, [visible]);

    useEffect(() => {
        if (!visible) return;
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
    }, [visible, latitude, longitude, locale]);

    return <div ref={node} className="mt-5 block h-[180px] w-full bg-field" />;
}
