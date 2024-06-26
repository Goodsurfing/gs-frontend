import { Clusterer } from "@pbe/react-yandex-maps";
import cn from "classnames";
import React, {
    FC, useState,
} from "react";

import { YMap, YmapType } from "@/entities/Map";

import defaultImage from "@/shared/assets/images/personalCardMOCK.png";
import "./yandex-map-restyle-ballon.scss";
import { OffersPlacemarkList } from "../OffersPlacemarkList/OffersPlacemarkList";
import styles from "./OffersMap.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";

interface OffersMapProps {
    className?: string;
    classNameMap?: string;
}

export const OffersMap: FC<OffersMapProps> = (props) => {
    const { className, classNameMap } = props;
    const { locale } = useLocale();
    const [ymap, setYmap] = useState<YmapType | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const testData = [
        {
            id: "1",
            geometry: [55.788028, 49.121729],
            image: defaultImage,
            title: "Тестовая вакансия1",
        },
        {
            id: "2",
            geometry: [55.78979, 49.117149],
            image: defaultImage,
            title: "Тестовая вакансия2",
        },
        {
            id: "3",
            geometry: [55.788824, 49.114648],
            image: defaultImage,
            title: "Тестовая вакансия3",
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
                    restrictMapArea: [[85.23618, -178.9], [-73.87011, 181]],
                    maxZoom: 18,
                }}
                className={cn(styles.map, classNameMap, {
                    [styles.loading]: !loading,
                })}
                setYmap={(ymaps) => setYmap(ymaps)}
                setLoading={setLoading}
                modules={["geoObject.addon.balloon"]}
            >
                {ymap && (
                    <Clusterer
                        options={{
                            zoomMargin: 15,
                            maxZoom: 18,
                        }}
                    >
                        <OffersPlacemarkList data={testData} />
                    </Clusterer>
                )}
            </YMap>
        </div>
    );
};
