import {
    Map, ObjectManager, YMaps,
} from "@pbe/react-yandex-maps";
import cn from "classnames";
import React, {
    FC, memo, useMemo, useRef, useState,
} from "react";

import { useLocale } from "@/app/providers/LocaleProvider";

import { YmapType } from "@/entities/Map";
import defaultImage from "@/shared/assets/images/default-offer-image.png";

import "./yandex-map-restyle-ballon.scss";
import { OfferMap } from "@/entities/Offer";
import styles from "./OffersMap.module.scss";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { getOfferPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { getMediaContent } from "@/shared/lib/getMediaContent";

interface OffersMapProps {
    className?: string;
    classNameMap?: string;
    offersData: OfferMap[];
    isOffersLoading: boolean;
}

export const OffersMap: FC<OffersMapProps> = memo((props: OffersMapProps) => {
    const {
        className, classNameMap, isOffersLoading,
        offersData,
    } = props;
    const { locale } = useLocale();
    const [ymapState, setYmapState] = useState<YmapType | undefined>(undefined);
    const mapRef = useRef<any>(null);
    const objectManagerRef = useRef<any>(null);

    const features = useMemo(() => {
        if (isOffersLoading || !offersData.length) return [];

        return offersData
            .filter((offer) => typeof offer.latitude === "number" && typeof offer.longitude === "number")
            .map((offer) => {
                const imgSrc = offer?.image?.contentUrl;
                const title = offer.name || "Без названия";
                const categoryName = offer.categories[0]?.name ?? "Без категории";
                const categoryColor = offer.categories[0]?.color ?? "var(--text-caption)";

                const balloonContent = `
          <div class="${styles.balloonWrapper}">
            <a href="${getOfferPersonalPageUrl(locale, offer.id.toString())}"><img class="${styles.balloonImage}" src="${getMediaContent(imgSrc) ?? defaultImage}" /></a>
            <div class="${styles.text}">
              <div class="${styles.balloonTitle}">${title}</div>
              <div class="${styles.balloonCategory}" style="color: ${categoryColor};">${categoryName}</div>
              <a href="${getOfferPersonalPageUrl(locale, offer.id.toString())}" class="${styles.balloonLink}">Подробнее</a>
            </div>
          </div>
        `;

                return {
                    type: "Feature",
                    id: offer.id.toString(),
                    geometry: { type: "Point", coordinates: [offer.latitude, offer.longitude] },
                    properties: {
                        name: offer.name ?? "Вакансия без названия",
                        balloonContent,
                        clusterCaption: offer.name ?? "Вакансия без названия",
                        hintContent: offer.name ?? "Вакансия без названия",
                    },
                    options: {
                        iconLayout: "default#imageWithContent",
                        iconContentLayout: ymapState?.templateLayoutFactory.createClass(
                            `<div style="background-color: ${categoryColor || "var(--accent-color)"};" class="${styles.customPlacemarkIcon}"></div>`,
                        ),
                        iconImageSize: [30, 30],
                        iconImageOffset: [-15, -15],
                    },
                };
            });
    }, [isOffersLoading, offersData, locale, ymapState?.templateLayoutFactory]);

    if (isOffersLoading) {
        return (
            <div className={cn(className, styles.wrapper)}>
                <div className={styles.loadingPlaceholder}>
                    <MiniLoader />
                </div>
            </div>
        );
    }

    return (
        <div className={cn(className, styles.wrapper)}>
            <YMaps query={{ load: "package.full" }}>
                <Map
                    defaultState={{
                        center: [50, 50], zoom: 2, controls: [],
                    }}
                    width="100%"
                    height="100%"
                    instanceRef={mapRef}
                    options={{
                        suppressMapOpenBlock: true,
                        restrictMapArea: [
                            [85.23618, -178.9],
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
                                <h3>Список вакансий:</h3>
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
