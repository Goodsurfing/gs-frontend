"use client";

import { useCallback, useEffect, useEffectEvent, useMemo, useRef, useState } from "react";

import type { MapOffer } from "@/lib/mapOffers";

import { MapControls } from "./MapControls";
import { MapPopup, type MapPopupContent, type PopupOffer } from "./MapPopup";
import { loadYmaps } from "./yandexMaps";

/* eslint-disable @typescript-eslint/no-explicit-any -- нетипизированное API Яндекс.Карт 2.1 */

// Как в старом фронте: весь мир, максимум — 18
const MAP_STATE = { center: [50, 50], zoom: 2.05, controls: [] as string[] };
const MAP_OPTIONS = {
    suppressMapOpenBlock: true,
    restrictMapArea: [[83.23618, -178.9], [-73.87011, 181]],
    maxZoom: 18,
    copyrightProvidersVisible: false,
    copyrightLogoVisible: false,
    copyrightUaVisible: false,
};
// Фокус на выбранной вакансии
const FOCUS_ZOOM = 10;
// Шаг дозума, пока выбранная вакансия ещё внутри кластера
const DECLUSTER_ZOOM_STEP = 2;
const DECLUSTER_ATTEMPTS = 8;
const DEFAULT_COLOR = "#3dabf7";

/*
 * Отметка — кружок цвета категории с белым кольцом и тенью (пастельные цвета
 * категорий иначе теряются на светлой подложке), при наведении чуть
 * увеличивается; выбранная вакансия — крупнее, с синим кольцом. Кластер —
 * синий кружок с ореолом, размер растёт с числом вакансий. Цвет и признак
 * выбора — из properties: один шаблон на все отметки. Шаблон рисуется от
 * точки привязки вправо-вниз — отрицательные отступы центрируют его на точке.
 */
const MARKER_TEMPLATE = [
    "{% if properties.selected %}",
    '<div class="-mt-[18px] -ml-[18px] box-border h-9 w-9 rounded-full border-[3px] border-white shadow-[0_0_0_3px_#3dabf7,0_4px_12px_rgba(14,29,39,0.35)]" style="background-color: {{ properties.color }}"></div>',
    "{% else %}",
    '<div class="-mt-[13px] -ml-[13px] box-border h-[26px] w-[26px] cursor-pointer rounded-full border-[3px] border-white shadow-[0_0_0_1px_rgba(14,29,39,0.25),0_2px_6px_rgba(14,29,39,0.3)] transition-transform duration-150 hover:scale-125" style="background-color: {{ properties.color }}"></div>',
    "{% endif %}",
].join("");
const CLUSTER_BASE = "box-border flex cursor-pointer items-center justify-center rounded-full border-[3px] border-white bg-primary font-bold text-white shadow-[0_0_0_6px_rgba(61,171,247,0.25),0_4px_10px_rgba(14,29,39,0.25)] transition-transform duration-150 hover:scale-110";
const CLUSTER_TEMPLATE = [
    "{% if properties.geoObjects.length > 99 %}",
    `<div class="-mt-6 -ml-6 h-12 w-12 text-[15px] ${CLUSTER_BASE}">{{ properties.geoObjects.length }}</div>`,
    "{% elseif properties.geoObjects.length > 9 %}",
    `<div class="-mt-5 -ml-5 h-10 w-10 text-[14px] ${CLUSTER_BASE}">{{ properties.geoObjects.length }}</div>`,
    "{% else %}",
    `<div class="-mt-[17px] -ml-[17px] h-[34px] w-[34px] text-[13px] ${CLUSTER_BASE}">{{ properties.geoObjects.length }}</div>`,
    "{% endif %}",
].join("");

export interface OffersMapLabels {
    more: string;
    clusterTitle: string;
    noTitle: string;
    close: string;
    zoomIn: string;
    zoomOut: string;
    locate: string;
    locateError: string;
    noLocation: string;
    empty: string;
    loadError: string;
    loadErrorHint: string;
    retry: string;
    mapError: string;
    reload: string;
}

type Popup = { content: MapPopupContent; coords: [number, number] };
type MapApi = { map: any; manager: any };
/** Результат загрузки отметок для конкретного набора фильтров */
type Loaded = { key: string; offers: MapOffer[] | null };

const OUTLINE_BUTTON = "cursor-pointer rounded-[10px] border border-primary px-[100px] py-3 text-label text-primary transition-colors hover:bg-primary hover:text-white";

/**
 * Карта каталога вакансий: все отметки по текущим фильтрам, кластеры, карточка
 * вакансии по клику на отметку, список вакансий по клику на кластер, фокус на
 * вакансии, выбранной в списке.
 *
 * Отличия от старого фронта (react-yandex-maps):
 * - отметки грузятся одним запросом по фильтрам, а не кусками по видимой
 *   области на каждое движение — нет мигания и гонок при выборе вакансии;
 * - карточки — свои, а не балуны Яндекса: стилизация балунов ломалась
 *   (прозрачный фон, «двухпанельный» кластерный балун поверх тайлов) и
 *   держалась на CSS-заплатках к версии API.
 */
export function OffersMap({ locale, filtersQuery, selectedOfferId, offerHref, labels, pointsUrl = "/web/api/map-offers", className = "" }: {
    locale: string;
    /** Откуда брать точки (по умолчанию — вакансии; у карты сборов свой адрес) */
    pointsUrl?: string;
    /** Фильтры каталога в формате адреса страницы (без page и offerId) */
    filtersQuery: string;
    selectedOfferId?: number | string;
    /** Шаблон адреса вакансии: {id} заменяется на номер */
    offerHref: string;
    labels: OffersMapLabels;
    className?: string;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const [api, setApi] = useState<MapApi | null>(null);
    const [mapFailed, setMapFailed] = useState(false);
    const [loaded, setLoaded] = useState<Loaded | null>(null);
    const [reloadKey, setReloadKey] = useState(0);
    const [popup, setPopup] = useState<Popup | null>(null);

    const dataKey = `${locale}|${filtersQuery}|${reloadKey}`;
    const offers = loaded?.key === dataKey ? loaded.offers : undefined;
    const dataStatus = offers === undefined ? "loading" : offers === null ? "error" : "ready";
    const byId = useMemo(() => new Map((offers ?? []).map((offer) => [offer.id, offer])), [offers]);

    const hrefFor = useCallback((id: number | string) => offerHref.replace("{id}", String(id)), [offerHref]);
    const toPopupOffer = useCallback((offer: MapOffer, small = false): PopupOffer => ({
        id: offer.id,
        name: offer.name || labels.noTitle,
        href: hrefFor(offer.id),
        image: small ? offer.imageSmall : offer.image,
        category: offer.category,
    }), [hrefFor, labels.noTitle]);

    // Обработчики кликов по карте видят актуальные данные без пересоздания карты
    const onObjectClick = useEffectEvent((id: number | string) => {
        const offer = byId.get(id);
        if (offer) setPopup({ coords: [offer.lat, offer.lng], content: { kind: "offer", offer: toPopupOffer(offer) } });
    });
    const onClusterClick = useEffectEvent((ids: (number | string)[], coords: [number, number]) => {
        const items = ids.map((id) => byId.get(id)).filter((offer): offer is MapOffer => Boolean(offer));
        setPopup({ coords, content: { kind: "cluster", offers: items.map((offer) => toPopupOffer(offer, true)) } });
    });

    // Карта создаётся один раз на язык
    useEffect(() => {
        const node = containerRef.current;
        if (!node) return;
        let cancelled = false;
        let created: MapApi | null = null;

        loadYmaps(locale).then((ymaps) => {
            if (cancelled) return;
            const map = new ymaps.Map(node, MAP_STATE, MAP_OPTIONS);

            // Опции кластеров у ObjectManager задаются в конструкторе с префиксом cluster*
            const manager = new ymaps.ObjectManager({
                clusterize: true,
                gridSize: 64,
                clusterIconLayout: ymaps.templateLayoutFactory.createClass(CLUSTER_TEMPLATE),
                clusterIconShape: { type: "Circle", coordinates: [0, 0], radius: 24 },
                clusterOpenBalloonOnClick: false,
                // Иначе клик по кластеру только приближает карту и до списка дело не доходит
                clusterDisableClickZoom: true,
            });
            manager.objects.options.set({
                iconLayout: ymaps.templateLayoutFactory.createClass(MARKER_TEMPLATE),
                iconShape: { type: "Circle", coordinates: [0, 0], radius: 16 },
                openBalloonOnClick: false,
            });
            manager.objects.events.add("click", (event: any) => onObjectClick(event.get("objectId")));
            manager.clusters.events.add("click", (event: any) => {
                const cluster = manager.clusters.getById(event.get("objectId"));
                if (!cluster) return;
                onClusterClick(
                    (cluster.properties.geoObjects as { id: number | string }[]).map((geoObject) => geoObject.id),
                    cluster.geometry.coordinates,
                );
            });
            // Клик по пустому месту карты закрывает карточку
            map.events.add("click", () => setPopup(null));
            map.geoObjects.add(manager);

            created = { map, manager };
            setContainer(node);
            setApi(created);
        }).catch(() => {
            if (!cancelled) setMapFailed(true);
        });

        return () => {
            cancelled = true;
            created?.map.destroy();
            setApi(null);
        };
    }, [locale]);

    // Карту показали или изменили её размер (свернули список, переключили вкладку на телефоне)
    useEffect(() => {
        const node = containerRef.current;
        if (!api || !node) return;
        const observer = new ResizeObserver(() => {
            if (node.offsetWidth > 0 && node.offsetHeight > 0) api.map.container.fitToViewport();
        });
        observer.observe(node);
        return () => observer.disconnect();
    }, [api]);

    // Отметки по фильтрам
    useEffect(() => {
        const abort = new AbortController();
        const query = new URLSearchParams(filtersQuery);
        query.set("locale", locale);
        fetch(`${pointsUrl}?${query}`, { signal: abort.signal })
            .then((response) => (response.ok ? response.json() as Promise<MapOffer[]> : Promise.reject(new Error(String(response.status)))))
            .then((data) => setLoaded({ key: dataKey, offers: data }))
            .catch(() => {
                if (!abort.signal.aborted) setLoaded({ key: dataKey, offers: null });
            });
        return () => abort.abort();
    }, [dataKey, filtersQuery, locale, pointsUrl]);

    // Отметки → ObjectManager
    useEffect(() => {
        if (!api || !offers) return;
        api.manager.removeAll();
        api.manager.add({
            type: "FeatureCollection",
            features: offers.map((offer) => ({
                type: "Feature",
                id: offer.id,
                geometry: { type: "Point", coordinates: [offer.lat, offer.lng] },
                properties: { color: offer.category?.color || DEFAULT_COLOR, hintContent: offer.name || labels.noTitle },
            })),
        });
    }, [api, offers, labels.noTitle]);

    // Выделение выбранной вакансии — меняем свойство одной отметки, а не перестраиваем все
    useEffect(() => {
        if (!api || !offers || selectedOfferId === undefined || !api.manager.objects.getById(selectedOfferId)) return;
        api.manager.objects.setObjectProperties(selectedOfferId, { selected: true });
        return () => {
            if (api.manager.objects.getById(selectedOfferId)) api.manager.objects.setObjectProperties(selectedOfferId, { selected: false });
        };
    }, [api, offers, selectedOfferId]);

    // Вакансия выбрана в списке: подлететь, раскрыть кластер, показать карточку
    const selected = selectedOfferId !== undefined ? byId.get(selectedOfferId) : undefined;
    const openSelected = useEffectEvent((offer: MapOffer) => {
        setPopup({ coords: [offer.lat, offer.lng], content: { kind: "offer", offer: toPopupOffer(offer) } });
    });
    useEffect(() => {
        if (!api || !selected) return;
        const { map, manager } = api;
        let cancelled = false;
        const reveal = (attempt: number) => {
            if (cancelled) return;
            const state = manager.getObjectState(selected.id);
            // Вакансии с одинаковыми координатами не разъедутся ни на каком масштабе — не приближаем зря
            const sameSpot = state?.isClustered && (state.cluster?.properties.geoObjects as { geometry: { coordinates: [number, number] } }[] | undefined)
                ?.every(({ geometry }) => geometry.coordinates[0] === selected.lat && geometry.coordinates[1] === selected.lng);
            if (state?.isClustered && !sameSpot && attempt < DECLUSTER_ATTEMPTS && map.getZoom() < MAP_OPTIONS.maxZoom) {
                map.setZoom(Math.min(map.getZoom() + DECLUSTER_ZOOM_STEP, MAP_OPTIONS.maxZoom), { duration: 300 })
                    .then(() => reveal(attempt + 1));
                return;
            }
            openSelected(selected);
        };
        map.setCenter([selected.lat, selected.lng], Math.max(map.getZoom(), FOCUS_ZOOM), { duration: 400 })
            .then(() => reveal(0));
        return () => {
            cancelled = true;
        };
    }, [api, selected]);

    // Escape закрывает карточку
    useEffect(() => {
        if (!popup) return;
        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") setPopup(null);
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [popup]);

    // Карточка вакансии, которой больше нет среди отметок (сменились фильтры), не показывается
    const visiblePopup = popup && (popup.content.kind === "cluster" || byId.has(popup.content.offer.id)) ? popup : null;
    const empty = api && dataStatus === "ready" && offers?.length === 0;
    const noLocation = api && dataStatus === "ready" && selectedOfferId !== undefined && !selected;

    return (
        <div className={`relative h-full w-full ${className}`}>
            <div ref={containerRef} className="gs-offers-map h-full w-full" />

            {api && visiblePopup && (
                <MapPopup
                    map={api.map}
                    container={container}
                    coords={visiblePopup.coords}
                    content={visiblePopup.content}
                    labels={{ more: labels.more, clusterTitle: labels.clusterTitle, close: labels.close }}
                    onClose={() => setPopup(null)}
                />
            )}

            {api && <MapControls map={api.map} maxZoom={MAP_OPTIONS.maxZoom} labels={{ zoomIn: labels.zoomIn, zoomOut: labels.zoomOut, locate: labels.locate, locateError: labels.locateError }} />}

            {(empty || noLocation) && (
                <div role="status" className="absolute top-4 left-1/2 z-10 max-w-[calc(100%-32px)] -translate-x-1/2 rounded-[10px] bg-white px-4 py-2.5 text-center text-[14px] font-medium shadow-[0_5px_20px_0_#2121210d]">
                    {noLocation ? labels.noLocation : labels.empty}
                </div>
            )}

            {!api && !mapFailed && <div aria-hidden className="absolute inset-0 z-20 animate-pulse bg-white/50" />}

            {api && dataStatus === "error" && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-white/50 px-4 text-center">
                    <p className="text-[14px] font-medium">{labels.loadError}</p>
                    <p className="text-[14px]">{labels.loadErrorHint}</p>
                    <button type="button" onClick={() => setReloadKey((key) => key + 1)} className={OUTLINE_BUTTON}>{labels.retry}</button>
                </div>
            )}

            {mapFailed && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-white px-4 text-center">
                    <p className="text-[14px] font-medium">{labels.mapError}</p>
                    <button type="button" onClick={() => window.location.reload()} className={OUTLINE_BUTTON}>{labels.reload}</button>
                </div>
            )}
        </div>
    );
}
