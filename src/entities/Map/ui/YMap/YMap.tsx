import React, { FC } from "react";
import { Map } from "@pbe/react-yandex-maps";
import classNames from "classnames";
import { MapDefaultState, YmapType } from "../../model/types/map";

import styles from "./Ymap.module.scss";

export interface MapProps {
    mapState?: MapDefaultState;
    className?: string;
    setLoading?: (isLoading: boolean) => void;
    setYmap?: (ymap: YmapType) => void;
    children?: React.ReactNode;
}

export const YMap: FC<MapProps> = ({
    mapState = {
        center: [55, 37],
        zoom: 5,
    },
    className,
    setLoading,
    setYmap,
    children,
}) => (
    <Map
        onLoad={(ymap) => {
            setLoading?.(true);
            setYmap?.(ymap);
        }}
        state={{
            center: mapState?.center,
            zoom: mapState?.zoom,
        }}
        className={classNames(styles.map, className)}
    >
        {children}
    </Map>
);
