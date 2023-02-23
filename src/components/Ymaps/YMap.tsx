import React, { FC } from "react";
import { Map as YMap } from "react-yandex-maps";

import { IYandexMap } from "./types/ymaps";

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
    children
}) => {
    return (
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
    );
};

export default YandexMap;
