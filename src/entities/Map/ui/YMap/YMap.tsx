import React, { FC, useState } from "react";
import { Map } from "@pbe/react-yandex-maps";
import classNames from "classnames";
import { YMapsModules } from "@pbe/react-yandex-maps/typings/util/typing";
import { MapDefaultState, YmapType } from "../../model/types/map";

import styles from "./Ymap.module.scss";

export interface MapProps {
    modules?: YMapsModules;
    mapState?: MapDefaultState;
    className?: string;
    setLoading?: (isLoading: boolean) => void;
    setYmap?: (ymap: YmapType) => void;
    options?: any;
    children?: React.ReactNode;
}

export const YMap: FC<MapProps> = ({
    modules,
    mapState = {
        center: [55, 37],
        zoom: 5,
    },
    className,
    setLoading,
    setYmap,
    options,
    children,
}) => {
    const [mapLoaded, setMapLoaded] = useState(false);
    return (
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
    );
};
