import React, { FC } from "react";
import { Map, YMaps } from "@pbe/react-yandex-maps";
import ymaps from "yandex-maps";
import classNames from "classnames";

import styles from "./Ymap.module.scss";

export type MapDefaultState = {
    center: [number, number];
    zoom: number;
};

export type GeoObjectHintType = {
    GeoObject: {
        Point: { pos: Array<string> };
        description: string;
        name: string;
    };
};

export type YmapType = typeof ymaps;

export type YmapQueryType = {
    ns: string;
    load: string;
};

export interface MapProps {
    defaultState?: MapDefaultState;
    query?: YmapQueryType;
    className?: string;
    setLoading?: (isLoading: boolean) => void;
    setYmap?: (ymap: YmapType) => void;
}

export const YMap: FC<MapProps> = ({
    defaultState = {
        center: [55, 37],
        zoom: 5,
    },
    className,
    setLoading,
    setYmap,
    query,
    children,
}) => {
    return (
        <YMaps query={
            {
                apikey: process.env.REACT_APP_API_YANDEX_KEY,
                ns: query?.ns,
                load: query?.load || "package.full",
            }
        }
        >
            <Map
                onLoad={(ymap) => {
                    setLoading?.(true);
                    setYmap?.(ymap);
                }}
                className={classNames(styles.map, className)}
                defaultState={defaultState}
            >
                {children}
            </Map>
        </YMaps>
    );
};
