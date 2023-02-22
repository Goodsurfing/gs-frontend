import React, { FC, useEffect, useState } from "react";
import { Placemark, Map as YMap, YMaps } from "react-yandex-maps";

import { YMapType } from "./types/ymaps";

interface IYmapWithAddress {
    width: string;
    height: string;
    ymap: YMapType;
    setYmap: (ymap: YMapType) => void;
    className?: string;
}

const YMapWithAddress: FC<IYmapWithAddress> = ({
    width,
    height,
    ymap,
    setYmap,
    className,
}) => {
    const [map, setMap] = useState<any>();
    const [location, setLocation] = useState<Array<number>>([55.7887, 49.1221]);

    return (
        <YMaps>
            <YMap
                instanceRef={map}
                module={["geocode"]}
                width={width}
                height={height}
                state={{ center: location, zoom: 10 }}
                onLoad={(ymap) => setYmap(ymap)}
            >
                <Placemark
                    options={{
                        preset: "islands#circleIcon",
                        iconColor: "#0EC261",
                    }}
                    geometry={location}
                />
            </YMap>
        </YMaps>
    );
};

export default YMapWithAddress;
