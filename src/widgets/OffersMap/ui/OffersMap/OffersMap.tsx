import { Clusterer } from "@pbe/react-yandex-maps";
import cn from "classnames";
import React, { FC, useState } from "react";

import ymaps from "yandex-maps";
import { useLocale } from "@/app/providers/LocaleProvider";

import { YMap } from "@/entities/Map";

import defaultImage from "@/shared/assets/images/personalCardMOCK.png";

import { OffersPlacemarkList } from "../OffersPlacemarkList/OffersPlacemarkList";
import styles from "./OffersMap.module.scss";
import "./yandex-map-restyle-ballon.scss";
import { useCategories } from "@/shared/data/categories";

interface OffersMapProps {
    className?: string;
    classNameMap?: string;
}

export const OffersMap: FC<OffersMapProps> = (props) => {
    const { className, classNameMap } = props;
    const { locale } = useLocale();
    const [ymap, setYmap] = useState<typeof ymaps | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const { getColorByCategory } = useCategories();

    const testData = [
        {
            id: "1",
            geometry: [55.788028, 49.121729],
            image: defaultImage,
            title: "Тестовая вакансия1",
            category: "farm",
        },
        {
            id: "2",
            geometry: [55.78979, 49.117149],
            image: defaultImage,
            title: "Тестовая вакансия2",
            category: "teaching",
        },
        {
            id: "3",
            geometry: [55.788824, 49.114648],
            image: defaultImage,
            title: "Тестовая вакансия3",
            category: "hostels",
        },
    ];

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
                        }}
                    >
                        <OffersPlacemarkList data={testData} />
                    </Clusterer>
                )}
            </YMap>
        </div>
    );
};
