"use client";

import { useEffect, useRef } from "react";

import { loadYmaps, type Ymaps } from "@/components/offers-map/yandexMaps";
import { DEFAULT_MAP_CENTER } from "@/lib/offerWizard";

/**
 * Карта выбора места (YMap в MapWithAddress старого фронта): масштаб 10, без
 * элементов управления и промо-ссылок Яндекса («Как добраться», такси) —
 * в старом фронте их не было; щелчок по карте
 * сообщает координаты, метка — у выбранной точки, карта следует за ней.
 */
export function PickPlaceMap({ point, locale, onPick }: {
    /** [широта, долгота] выбранной точки */
    point: [number, number] | null;
    locale: string;
    onPick: (latitude: number, longitude: number) => void;
}) {
    const node = useRef<HTMLDivElement>(null);
    const map = useRef<Ymaps | null>(null);
    const ymapsRef = useRef<Ymaps | null>(null);
    const mark = useRef<Ymaps | null>(null);
    const pick = useRef(onPick);
    const initial = useRef(point);

    useEffect(() => {
        pick.current = onPick;
    }, [onPick]);

    useEffect(() => {
        let cancelled = false;
        loadYmaps(locale)
            .then((ymaps) => {
                if (cancelled || !node.current) return;
                ymapsRef.current = ymaps;
                const instance = new ymaps.Map(node.current, { center: initial.current ?? DEFAULT_MAP_CENTER, zoom: 10, controls: [] }, { suppressMapOpenBlock: true });
                instance.events.add("click", (event: Ymaps) => {
                    const [latitude, longitude] = event.get("coords") as [number, number];
                    pick.current(latitude, longitude);
                });
                map.current = instance;
                if (initial.current) {
                    mark.current = new ymaps.Placemark(initial.current);
                    instance.geoObjects.add(mark.current);
                }
            })
            .catch(() => undefined);
        return () => {
            cancelled = true;
            map.current?.destroy();
            map.current = null;
            mark.current = null;
        };
    }, [locale]);

    const [latitude, longitude] = point ?? [null, null];
    useEffect(() => {
        const instance = map.current;
        const ymaps = ymapsRef.current;
        if (!instance || !ymaps) return;
        if (mark.current) instance.geoObjects.remove(mark.current);
        mark.current = null;
        if (latitude === null || longitude === null) return;
        mark.current = new ymaps.Placemark([latitude, longitude]);
        instance.geoObjects.add(mark.current);
        instance.setCenter([latitude, longitude]);
    }, [latitude, longitude]);

    return <div ref={node} data-testid="offer-where-map" className="mt-8 block h-[350px] w-full down-lg:h-[50vh] [&_[class*='-map-copyrights-promo']]:hidden" />;
}
