import { Clusterer } from "@pbe/react-yandex-maps";
import cn from "classnames";
import React, { FC, memo, useState } from "react";

import { useLocale } from "@/app/providers/LocaleProvider";

import { YMap, YmapType } from "@/entities/Map";

import { OffersPlacemarkList } from "../OffersPlacemarkList/OffersPlacemarkList";
import "./yandex-map-restyle-ballon.scss";
import { OfferApi } from "@/entities/Offer";
import styles from "./OffersMap.module.scss";

interface OffersMapProps {
    className?: string;
    classNameMap?: string;
    offersData?: OfferApi[]
}

export const OffersMap: FC<OffersMapProps> = memo((props: OffersMapProps) => {
    const { className, classNameMap, offersData } = props;
    const { locale } = useLocale();
    const [ymap, setYmap] = useState<YmapType | undefined>(undefined);
    const [loading, setLoading] = useState(false);

    return (
        <div className={cn(className, styles.wrapper)}>
            <YMap
                locale={locale}
                mapState={{
                    center: [50, 50],
                    zoom: 2,
                }}
                options={{
                    suppressMapOpenBlock: true,
                    restrictMapArea: [
                        [85.23618, -178.9],
                        [-73.87011, 181],
                    ],
                    maxZoom: 18,
                }}
                className={cn(styles.map, classNameMap, {
                    [styles.loading]: !loading,
                })}
                setYmap={(ymapsMap) => setYmap(ymapsMap)}
                setLoading={setLoading}
                modules={[
                    "geoObject.addon.balloon",
                    "templateLayoutFactory",
                    "clusterer.addon.balloon",
                    "layout.ImageWithContent",
                ]}
            >
                {ymap && (
                    <Clusterer
                        options={{
                            iconLayout: "default#imageWithContent",
                            clusterIconLayout: ymap?.templateLayoutFactory.createClass(
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
                            clusterBalloonContentLayout: ymap?.templateLayoutFactory.createClass(`
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
                    >
                        <OffersPlacemarkList data={offersData ?? []} />
                    </Clusterer>
                )}
            </YMap>
        </div>
    );
});
