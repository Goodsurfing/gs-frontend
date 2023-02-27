import React, { FC } from "react";
import { Map as YMap, YMaps } from "react-yandex-maps";

import { IYandexMap, YMapType } from "./types/ymaps";

const YandexMap: FC<IYandexMap> = ({
    defaultLocation,
    location,
    width = "100%",
    height = "100%",
    zoom,
    ymap,
    setYmap,
    modules,
    className,
    children,
}) => {
    return (
        <YMaps query={{ apikey: process.env.REACT_APP_API_YANDEX_KEY }}>
            <YMap
                modules={modules}
                state={{ center: location ?? defaultLocation, zoom }}
                onLoad={setYmap}
                width={width}
                height={height}
                className={className}
            >
                {children}
            </YMap>
        </YMaps>
    );
};

export default YandexMap;
