import React, { FC } from "react";
import { Map, YMaps, Placemark } from "@pbe/react-yandex-maps";
import classNames from "classnames";

import styles from "./Ymap.module.scss";

type MapDefaultState = {
    center: [number, number];
    zoom: number;
};

export interface MapProps {
    defaultState?: MapDefaultState;
    className?: string;
}

const YMap: FC<MapProps> = ({
    defaultState = {
        center: [55, 37],
        zoom: 5,
    },
    className,
}) => {
    return (
        <YMaps>
            <Map className={classNames(styles.map, className)} defaultState={defaultState}>
                <Placemark />
            </Map>
        </YMaps>
    );
};

export default YMap;
