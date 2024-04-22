import React, { FC, useState } from "react";
import { Map, YMaps } from "@pbe/react-yandex-maps";
import classNames from "classnames";
import { MapDefaultState, YmapType } from "../../model/types/map";

import styles from "./Ymap.module.scss";
import { Locale } from "@/entities/Locale";

export interface MapProps {
    locale: Locale;
    mapState?: MapDefaultState;
    className?: string;
    setLoading?: (isLoading: boolean) => void;
    setYmap?: (ymap: YmapType) => void;
    children?: React.ReactNode;
}

type YandexLanguageType = "en_US" | "ru_RU";

const languageList: Record<Locale, YandexLanguageType> = {
    en: "en_US",
    ru: "ru_RU",
    es: "en_US",
};

export const YMap: FC<MapProps> = ({
    mapState = {
        center: [55, 37],
        zoom: 5,
    },
    className,
    setLoading,
    setYmap,
    children,
    locale,
}) => {
    const [mapLoaded, setMapLoaded] = useState(false);
    return (
        <YMaps key={locale} query={{ lang: languageList[locale] }}>
            <Map
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
            >
                {mapLoaded && children}
            </Map>
        </YMaps>
    );
};
