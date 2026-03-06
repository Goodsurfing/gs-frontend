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

import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { getOfferPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import "./yandex-map-restyle-ballon.scss";
import { GetDonationsMap } from "@/entities/Donation";
import styles from "./DonationsMap.module.scss";

interface DonationsMapProps {
    className?: string;
    classNameMap?: string;
    donationsData: GetDonationsMap[];
    isDonationsLoading: boolean;
}

export const DonationsMap: FC<DonationsMapProps> = memo((props: DonationsMapProps) => {
    const {
        className, classNameMap, isDonationsLoading,
        donationsData,
    } = props;
    const { locale } = useLocale();
    const [ymapState, setYmapState] = useState<YmapType | undefined>(undefined);
    const mapRef = useRef<any>(null);
    const objectManagerRef = useRef<any>(null);

    const features = useMemo(() => {
        if (isDonationsLoading || !donationsData.length) return [];

        return donationsData
            .filter((donation) => typeof donation.latitude === "number" && typeof donation.longitude === "number")
            .map((donation) => {
                const imgSrc = donation?.image?.contentUrl;
                const title = donation.name || "Без названия";
                const categoryName = donation.categories[0]?.name ?? "Без категории";
                const categoryColor = donation.categories[0]?.color ?? "var(--text-caption)";

                const balloonContent = `
          <div class="${styles.balloonWrapper}">
            <a href="${getOfferPersonalPageUrl(locale, donation.id.toString())}"><img class="${styles.balloonImage}" src="${getMediaContent(imgSrc) ?? defaultImage}" /></a>
            <div class="${styles.text}">
              <div class="${styles.balloonTitle}">${title}</div>
              <div class="${styles.balloonCategory}" style="color: ${categoryColor};">${categoryName}</div>
              <a href="${getOfferPersonalPageUrl(locale, donation.id.toString())}" class="${styles.balloonLink}">Подробнее</a>
            </div>
          </div>
        `;

                return {
                    type: "Feature",
                    id: donation.id,
                    geometry: { type: "Point", coordinates: [donation.latitude, donation.longitude] },
                    properties: {
                        name: donation.name ?? "Сбор без названия",
                        balloonContent,
                        clusterCaption: donation.name ?? "Сбор без названия",
                        hintContent: donation.name ?? "Сбор без названия",
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
    }, [isDonationsLoading, donationsData, locale, ymapState?.templateLayoutFactory]);

    if (isDonationsLoading) {
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
