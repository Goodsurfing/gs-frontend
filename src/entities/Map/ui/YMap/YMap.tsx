import React, {
    FC, useEffect, useRef, useState,
} from "react";
import { Map, YMaps } from "@pbe/react-yandex-maps";
import classNames from "classnames";
import { YMapsModules } from "@pbe/react-yandex-maps/typings/util/typing";
import ymaps from "yandex-maps";
import { MapDefaultState } from "../../model/types/map";

import styles from "./Ymap.module.scss";
import { Locale } from "@/entities/Locale";

export interface MapProps {
    modules?: YMapsModules;
    locale: Locale;
    mapState?: MapDefaultState;
    className?: string;
    setLoading?: (isLoading: boolean) => void;
    setYmap?: (ymap: typeof ymaps) => void;
    onClick?: (coords: [number, number]) => void;
    options?: any;
    children?: React.ReactNode;
}

type YandexLanguageType = "en_US" | "ru_RU";

const languageList: Record<Locale, YandexLanguageType> = {
    en: "en_US",
    ru: "ru_RU",
    es: "en_US",
};

export const YMap: FC<MapProps> = ({
    modules,
    mapState = {
        center: [55, 37],
        zoom: 5,
    },
    className,
    setLoading,
    setYmap,
    onClick,
    options,
    children,
    locale = "ru",
}) => {
    const [mapLoaded, setMapLoaded] = useState(false);
    const mapRef = useRef<ymaps.Map | null>(null);
    const ymapInstanceRef = useRef<any>(null);

    useEffect(() => {
        if (mapRef.current && ymapInstanceRef.current) {
            const mapInstance = ymapInstanceRef.current;

            const handleMapClick = (event: any) => {
                const coords = event.get("coords");
                onClick?.(coords);
            };

            mapInstance.geoObjects.events.add("click", handleMapClick);
            mapInstance.events.add("click", handleMapClick);

            return () => {
                mapInstance.geoObjects.events.remove("click", handleMapClick);
                mapInstance.events.remove("click", handleMapClick);
            };
        }
    }, [mapLoaded, onClick]);

    return (
        <YMaps key={locale} query={{ lang: languageList[locale] }}>
            <Map
                options={options}
                onLoad={(ymap) => {
                    setLoading?.(true);
                    setYmap?.(ymap);
                    setMapLoaded(true);
                }}
                state={{
                    center: mapState?.center,
                    zoom: mapState?.zoom,
                }}
                className={classNames(styles.map, className)}
                modules={modules}
            >
                {mapLoaded && children}
            </Map>
        </YMaps>
    );
};
