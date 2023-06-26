import React, {
    ChangeEvent, FC, useCallback, useEffect, useState,
} from "react";

import styles from "./MapWithAddress.module.scss";
import Input from "@/shared/ui/Input/Input";
import Button from "@/shared/ui/Button/Button";
import { Variant } from "@/shared/ui/Button/Button.interface";
import { YMap, YmapType, GeoObjectHintType } from "@/entities/Map";
import useDebounce from "@/hooks/useDebounce";
import { getGeocodeByName } from "../model/utils/getGeocodeByName";
import {} from "../model/utils/getYmapCoordinates";
import { findCoordinates } from "../model/utils/findCoordinates";

interface MapWithAddressProps {}

export const MapWithAddress: FC<MapWithAddressProps> = () => {
    const [loading, setLoading] = useState(false);
    const [ymap, setYmap] = useState<YmapType | undefined>(undefined);

    const [isHintsLoading, setHintsLoading] = useState(false);

    const [hints, setHints] = useState<Array<GeoObjectHintType>>([]);

    const [coordinates, setCoordinates] = useState<[number, number]>([55, 47]);

    const [address, setAddress] = useState("");

    const handleAddressUpdate = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setAddress(e.target.value);
    }, []);

    const debouncedAddress = useDebounce(address, 500);

    useEffect(() => {
        if (debouncedAddress && ymap) {
            setHintsLoading(true);
            findCoordinates(ymap, debouncedAddress).then((res) => { return setCoordinates(res); });
            setHintsLoading(false);
        } else {
            setHints([]);
        }
    }, [debouncedAddress, ymap]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.content}>
                <Input placeholder="Начните вводить адрес" onChange={handleAddressUpdate} value={address} />
                <YMap
                    defaultState={{ center: coordinates, zoom: 9 }}
                    className={styles.map}
                    query={{
                        ns: "use-load-option",
                        load: "Map,Placemark,control.ZoomControl,geocode,geoObject.addon.hint",
                    }}
                    setYmap={(ymaps) => { return setYmap(ymaps); }}
                    setLoading={setLoading}
                />
            </div>
            <div>
                <Button variant={Variant.PRIMARY}>
                    Сохранить
                </Button>
            </div>
        </div>
    );
};
