import {
    Clusterer, Map, ObjectManager, YMaps,
} from "@pbe/react-yandex-maps";
import cn from "classnames";
import React, {
    FC, memo, useCallback, useEffect, useMemo, useRef, useState,
} from "react";

import { useLocale } from "@/app/providers/LocaleProvider";

import { YMap, YmapType } from "@/entities/Map";

import { OffersPlacemarkList } from "../OffersPlacemarkList/OffersPlacemarkList";
import "./yandex-map-restyle-ballon.scss";
import { OfferMap, useGetAllOffersMapQuery, useLazyGetOfferByIdQuery } from "@/entities/Offer";
import styles from "./OffersMap.module.scss";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { getOfferPersonalPageUrl } from "@/shared/config/routes/AppUrls";

interface OffersMapProps {
    className?: string;
    classNameMap?: string;
}

export const OffersMap: FC<OffersMapProps> = memo((props) => {
    const { className, classNameMap } = props;
    const { data: offersData = [], isLoading: offersLoading } = useGetAllOffersMapQuery();
    const { locale } = useLocale();
    const mapRef = useRef<any>(null);
    const objectManagerRef = useRef<any>(null);

    const features = useMemo(() => {
        if (offersLoading || !offersData.length) return [];

        return offersData
            .filter((offer) => typeof offer.latitude === "number" && typeof offer.longitude === "number")
            .map((offer) => {
                // const imgSrc = offer.description?.image?.contentUrl || "";
                const title = offer.name || "Без названия";
                const categoryName = "Категория";

                const balloonContent = `
          <div class="${styles.balloonWrapper}">
            <img class="${styles.balloonImage}" src="" />
            <div class="${styles.text}">
              <div class="${styles.balloonTitle}">${title}</div>
              <div class="${styles.balloonCategory}">${categoryName}</div>
              <a href="${getOfferPersonalPageUrl(locale, offer.id.toString())}" class="${styles.balloonLink}">Подробнее</a>
            </div>
          </div>
        `;

                return {
                    type: "Feature",
                    id: offer.id.toString(),
                    geometry: { type: "Point", coordinates: [offer.latitude, offer.longitude] },
                    properties: {
                        name: offer.name,
                        balloonContent,
                        clusterCaption: offer.name,
                        hintContent: offer.name,
                    },
                    options: {
                    },
                };
            });
    }, [offersData, offersLoading, locale]);

    if (offersLoading) {
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
                    defaultState={{ center: [50, 50], zoom: 2 }}
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
                    }}
                    className={cn(styles.map, classNameMap)}
                >
                    {features.length > 0 && (
                        <ObjectManager
                            instanceRef={objectManagerRef}
                            features={features}
                            options={{
                                clusterize: true,
                                gridSize: 64,
                                suppressMapOpenBlock: true,
                            }}
                            objects={{
                                preset: "islands#blueDotIcon",
                                openBalloonOnClick: true,
                            }}
                            clusters={{
                                preset: "islands#blueClusterIcons",
                            }}
                        />
                    )}
                </Map>
            </YMaps>
        </div>
    );
});
