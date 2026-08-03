import {
    Map, ObjectManager, YMaps, ZoomControl,
} from "@pbe/react-yandex-maps";
import cn from "classnames";
import React, {
    FC, memo, useEffect, useMemo, useRef, useState,
} from "react";
import { useTranslation } from "react-i18next";

import { useLocale } from "@/app/providers/LocaleProvider";

import { YmapType } from "@/entities/Map";
import defaultImage from "@/shared/assets/images/default-offer-image.png";

import "./yandex-map-restyle-ballon.scss";
import { OfferMap } from "@/entities/Offer";
import styles from "./OffersMap.module.scss";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { getOfferPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { getMediaContent } from "@/shared/lib/getMediaContent";

const FOCUS_ZOOM = 10;
const BOUNDS_CHANGE_DEBOUNCE_MS = 400;

export interface MapViewportBounds {
    boundsSwLat: number;
    boundsSwLng: number;
    boundsNeLat: number;
    boundsNeLng: number;
}

interface OffersMapProps {
    className?: string;
    classNameMap?: string;
    offersData: OfferMap[];
    isOffersLoading: boolean;
    selectedOfferId?: number;
    // undefined — нет выбора/ещё не знаем; объект — координаты для фокуса;
    // null — точно известно, что у вакансии нет координат (показать notice).
    // Намеренно НЕ выводится из offersData самой карты: после того как
    // маркеры стали viewport-scoped, отсутствие в offersData означает "вне
    // текущей видимой области", а не "нет координат вообще" — это два разных
    // случая, которые раньше смешивались.
    selectedOfferCoordinates?: { latitude: number; longitude: number } | null;
    onBoundsChange?: (bounds: MapViewportBounds) => void;
}

export const OffersMap: FC<OffersMapProps> = memo((props: OffersMapProps) => {
    const {
        className, classNameMap, isOffersLoading,
        offersData, selectedOfferId, selectedOfferCoordinates, onBoundsChange,
    } = props;
    const { locale } = useLocale();
    const { t } = useTranslation();
    const [ymapState, setYmapState] = useState<YmapType | undefined>(undefined);
    const [showNoLocationNotice, setShowNoLocationNotice] = useState(false);
    const mapRef = useRef<any>(null);
    const objectManagerRef = useRef<any>(null);
    const onBoundsChangeRef = useRef(onBoundsChange);
    onBoundsChangeRef.current = onBoundsChange;
    // Пока идёт bounds-рефетч, offersData на мгновение становится [] —
    // если сразу же чистить markers, ObjectManager размонтируется и
    // смонтируется заново при приходе новых данных, и карта один раз
    // моргает при каждом перемещении. Держим последний непустой набор
    // маркеров на экране, пока не придут новые (stale-while-revalidate).
    const lastFeaturesRef = useRef<any[]>([]);

    const noTitle = t("Без названия");
    const noCategory = t("Без категории");
    const offerWithoutName = t("Вакансия без названия");
    const learnMore = t("Подробнее");
    const vacancyListTitle = t("Список вакансий:");
    const noLocationText = t("У этой вакансии не указано местоположение на карте");

    const features = useMemo(() => {
        if (isOffersLoading || !offersData.length) return lastFeaturesRef.current;

        const computed = offersData
            .filter((offer) => typeof offer.latitude === "number" && typeof offer.longitude === "number")
            .map((offer) => {
                const imgSrc = offer?.image ?? undefined;
                const title = offer.name || noTitle;
                const categoryName = offer.categories[0]?.name ?? noCategory;
                const categoryColor = offer.categories[0]?.color ?? "var(--text-caption)";

                const offerUrl = getOfferPersonalPageUrl(locale, offer.id.toString());
                const balloonContent = `
          <div class="${styles.balloonWrapper}">
            <a href="${offerUrl}" class="${styles.balloonImageLink}">
              <img class="${styles.balloonImage}" src="${getMediaContent(imgSrc, "SMALL") ?? defaultImage}" />
            </a>
            <div class="${styles.text}">
              <div class="${styles.balloonTitle}">${title}</div>
              <div class="${styles.balloonCategory}" style="color: ${categoryColor};">${categoryName}</div>
              <a href="${offerUrl}" class="${styles.balloonLink}">${learnMore}</a>
            </div>
          </div>
        `;

                return {
                    type: "Feature",
                    id: offer.id.toString(),
                    geometry: { type: "Point", coordinates: [offer.latitude, offer.longitude] },
                    properties: {
                        name: offer.name ?? offerWithoutName,
                        balloonContent,
                        clusterCaption: offer.name ?? offerWithoutName,
                        hintContent: offer.name ?? offerWithoutName,
                    },
                    options: {
                        iconLayout: "default#imageWithContent",
                        iconContentLayout: ymapState?.templateLayoutFactory.createClass(
                            `<div style="background-color: ${categoryColor || "var(--accent-color)"};" class="${styles.customPlacemarkIcon}"></div>`,
                        ),
                        iconImageSize: [30, 30],
                        iconImageOffset: [-15, -15],
                        // Без iconShape Яндекс.Карты по умолчанию считают форму
                        // маркера прямоугольным пином, а не нашим кастомным
                        // кружком — из-за этого хвостик balloon указывал не в
                        // центр маркера. Круг тех же размеров/центра, что и сама
                        // иконка (без учёта iconImageOffset — как в
                        // clusterIconShape ниже).
                        iconShape: {
                            type: "Circle",
                            coordinates: [15, 15],
                            radius: 15,
                        },
                    },
                };
            });

        lastFeaturesRef.current = computed;
        return computed;
    }, [
        isOffersLoading, offersData, locale, ymapState?.templateLayoutFactory,
        noTitle, noCategory, offerWithoutName, learnMore,
    ]);

    useEffect(() => {
        if (!selectedOfferId || selectedOfferCoordinates === undefined) {
            setShowNoLocationNotice(false);
            return;
        }

        // Часть вакансий физически не имеет координат в базе (адрес не
        // геокодирован) — карте попросту нечем "сфокусироваться". Раньше
        // клик по такой карточке в списке просто ничего не делал молча,
        // что выглядело как баг; показываем явную причину вместо тишины.
        setShowNoLocationNotice(selectedOfferCoordinates === null);
        if (!selectedOfferCoordinates || !mapRef.current) return;

        const currentZoom = mapRef.current.getZoom();
        mapRef.current.setCenter(
            [selectedOfferCoordinates.latitude, selectedOfferCoordinates.longitude],
            Math.max(currentZoom, FOCUS_ZOOM),
            { duration: 400 },
        );

        // Клик по карточке в списке раньше молча подвигал карту, а подсказку
        // с превью вакансии видел только тот, кто кликнул прямо по маркеру.
        // Открываем тот же balloon программно, но только после того как pan
        // завершится (actionend) — иначе ObjectManager может не найти
        // объект, если он ещё не попал в текущий кластер на новом месте.
        const map = mapRef.current;
        const objectManager = objectManagerRef.current;
        if (!objectManager) return undefined;

        const openBalloon = () => {
            map.events.remove("actionend", openBalloon);
            // Даже после actionend объект может ещё не попасть в ObjectManager:
            // маркеры viewport-scoped (см. features выше) и приходят отдельным
            // bounds-запросом с 400мс дебаунсом ПОСЛЕ actionend, так что при
            // быстром переключении между вакансиями в списке (клик #1, клик #2
            // до того как домаунтился набор маркеров под клик #1) balloon.open
            // синхронно бросает TypeError ("Cannot read properties of null
            // (reading 'geometry')") внутри самого Яндекс.Карт SDK — .catch()
            // тут не помогает, потому что это не отклонённый Promise, а
            // синхронный throw. Без try/catch это разносило карту целиком.
            try {
                objectManager.objects.balloon.open(selectedOfferId.toString())?.catch(() => {});
            } catch {
                // объекта ещё нет на карте — тихо пропускаем, пользователь всё
                // равно уже увидел итог pan'а к нужным координатам
            }
        };
        map.events.add("actionend", openBalloon);
        return () => {
            map.events.remove("actionend", openBalloon);
        };
        // ymapState в зависимостях намеренно: ObjectManager монтируется
        // (и заполняет objectManagerRef) только после onLoad карты, который
        // может случиться позже, чем этот эффект уже отработал на первом
        // рендере с уже выбранной вакансией (например, ?offerId= в URL).
    }, [selectedOfferId, selectedOfferCoordinates, ymapState]);

    useEffect(() => {
        if (!ymapState || !mapRef.current) return undefined;

        const map = mapRef.current;
        let timeoutId: ReturnType<typeof setTimeout> | undefined;

        const emitBounds = () => {
            const bounds = map.getBounds?.();
            if (!bounds) return;
            const [[swLat, swLng], [neLat, neLng]] = bounds;
            // На мобильном эта же карта продолжает существовать в DOM, просто
            // скрыта через display:none (десктопная раскладка в
            // OffersSearchFilter.tsx) — Яндекс.Карты в нулевом контейнере
            // отдают вырожденный bounds, где SW и NE совпадают. Реальный pan/
            // zoom так не бывает; без этой проверки такой bounds улетает
            // наверх, там уходит в vacancy/for-map/list и стирает реальный
            // набор маркеров пустым ответом — в том числе у видимой мобильной
            // карты, которая делит один и тот же allOffersMap со скрытой.
            if (swLat === neLat && swLng === neLng) return;
            onBoundsChangeRef.current?.({
                boundsSwLat: swLat, boundsSwLng: swLng, boundsNeLat: neLat, boundsNeLng: neLng,
            });
        };

        const handleBoundsChange = () => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(emitBounds, BOUNDS_CHANGE_DEBOUNCE_MS);
        };

        map.events.add("boundschange", handleBoundsChange);
        emitBounds();

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            map.events.remove("boundschange", handleBoundsChange);
        };
    }, [ymapState]);

    return (
        <div className={cn(className, styles.wrapper)}>
            {isOffersLoading && (
                <div className={styles.loadingPlaceholder}>
                    <MiniLoader />
                </div>
            )}
            {showNoLocationNotice && (
                <div className={styles.noLocationNotice}>{noLocationText}</div>
            )}
            <YMaps query={{ apikey: import.meta.env.VITE_API_YANDEX_KEY, load: "package.full" }}>
                <Map
                    defaultState={{
                        center: [50, 50], zoom: 2.05, controls: [],
                    }}
                    width="100%"
                    height="100%"
                    instanceRef={mapRef}
                    options={{
                        suppressMapOpenBlock: true,
                        restrictMapArea: [
                            [83.23618, -178.9],
                            [-73.87011, 181],
                        ],
                        maxZoom: 18,
                        copyrightProvidersVisible: false,
                        copyrightLogoVisible: false,
                        copyrightUaVisible: false,
                        yandexMapDisablePoiInteractivity: false,
                        suppressObsoleteBrowserNotifier: false,
                    }}
                    onLoad={(ymap) => {
                        setYmapState(ymap);
                    }}
                    className={cn(styles.map, classNameMap)}
                >
                    <ZoomControl options={{ position: { right: 10, top: 10 } }} />
                    {(ymapState && (features.length > 0)) && (
                        <ObjectManager
                            instanceRef={objectManagerRef}
                            features={features}
                            options={{
                                clusterize: true,
                                gridSize: 64,
                            }}
                            objects={{
                                openBalloonOnClick: true,
                            }}
                            clusters={{
                                iconLayout: "default#imageWithContent",
                                clusterIconLayout: ymapState.templateLayoutFactory.createClass(
                                    `<div class="${styles.customClusterIcon}">
                                        {{ properties.geoObjects.length }}
                                    </div>`,
                                ),
                                clusterIconShape: {
                                    type: "Circle",
                                    coordinates: [20, 20],
                                    radius: 20,
                                },
                                clusterIconSize: [40, 40],
                                clusterIconOffset: [-20, -20],
                                clusterBalloonContentLayout: ymapState.templateLayoutFactory.createClass(`
                            <div class="${styles.clusterBalloon}">
                                <h3>${vacancyListTitle}</h3>
                                <ul>
                                    {% for geoObject in properties.geoObjects %}
                                        <li> <a href="{{geoObject.properties.url}}">{{ geoObject.properties.name }}</a></li>
                                    {% endfor %}
                                </ul>
                            </div>
                        `),
                                clusterBalloonPanelMaxMapArea: Infinity,
                                clusterBalloonContentLayoutHeight: 200,
                            }}

                        />
                    )}
                </Map>
            </YMaps>
        </div>
    );
});
