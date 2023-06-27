import React, { FC } from "react";
import { Map, YMaps } from "@pbe/react-yandex-maps";
import classNames from "classnames";
import { MapDefaultState, YmapQueryType, YmapType } from "../../model/types/map";

import styles from "./Ymap.module.scss";


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
                state={defaultState}
                className={classNames(styles.map, className)}
            >
                {children}
            </Map>
        </YMaps>
    );
};
