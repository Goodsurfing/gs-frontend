import React, {
    ChangeEvent, FC, useCallback, useEffect, useState,
} from "react";

import cn from "classnames";

import { YMap, YmapType, GeoObject } from "@/entities/Map";

import Input from "@/shared/ui/Input/Input";

import { getGeocodeByName } from "../model/utils/getGeocodeByName";
import { findCoordinates } from "../model/utils/findCoordinates";

import useDebounce from "@/shared/hooks/useDebounce";

import styles from "./MapWithAddress.module.scss";
import { getGeoObjectCollection } from "../model/services/getGeoObjectCollection/getGeoObjectCollection";

interface MapWithAddressProps {
    className?: string;
    onAddressChange?: (value: string) => void;
}

export const MapWithAddress: FC<MapWithAddressProps> = ({ className, onAddressChange }) => {
    const [loading, setLoading] = useState(false);

    const [ymap, setYmap] = useState<YmapType | undefined>(undefined);

    const [isHintsLoading, setHintsLoading] = useState(false);

    const [hints, setHints] = useState<GeoObject[]>([]);

    const [coordinates, setCoordinates] = useState<[number, number]>([55, 47]);

    const [address, setAddress] = useState("");

    const handleAddressUpdate = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setAddress(e.target.value);
    }, []);

    const debouncedAddress = useDebounce(address, 500);

    useEffect(() => {
        (async () => {
            if (debouncedAddress && ymap) {
                setHintsLoading(true);
                const data = await getGeoObjectCollection(debouncedAddress);
                if (data && data.featureMember.length) {
                    setHintsLoading(false);
                    setHints(data.featureMember.map((item) => {
                        return item.GeoObject;
                    }));
                } else {
                    setHints([]);
                }
            }
        })();
    }, [debouncedAddress, ymap]);

    return (
        <div className={cn(styles.wrapper, className)}>
            <div className={styles.content}>
                <Input placeholder="Начните вводить адрес" onChange={handleAddressUpdate} value={address} />
                <YMap
                    defaultState={{ center: coordinates, zoom: 9 }}
                    className={styles.map}
                    query={{
                        ns: "use-load-option",
                        load: "Map,Placemark,control.ZoomControl,geocode,geoObject.addon.hint",
                    }}
                    setYmap={(ymaps) => {
                        return setYmap(ymaps);
                    }}
                    setLoading={setLoading}
                />
            </div>
        </div>
    );
};
