import React, {
    ChangeEvent, FC, useCallback, useEffect, useState,
} from "react";

import styles from "./MapWithAddress.module.scss";
import Input from "@/UI/Input/Input";
import Button from "@/UI/Button/Button";
import { Variant } from "@/UI/Button/Button.interface";
import { YMap, YmapType, GeoObjectHintType } from "@/entities/Map";
import useDebounce from "@/hooks/useDebounce";

interface MapWithAddressProps {}

export const MapWithAddress: FC<MapWithAddressProps> = () => {
    const [loading, setLoading] = useState(false);
    const [ymap, setYmap] = useState<YmapType | undefined>(undefined);

    const [isHintsLoading, setHintsLoading] = useState(false);

    const [hints, setHints] = useState<Array<GeoObjectHintType>>([]);

    const [address, setAddress] = useState("");

    const handleAddressUpdate = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setAddress(e.target.value);
    }, []);

    const debouncedAddress = useDebounce(address, 500);

    useEffect(() => {
        if (debouncedAddress && ymap) {
            setHintsLoading(true);
            
            setHintsLoading(false);
        } else {
            setHints([]);
        }
    }, [debouncedAddress, ymap]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.content}>
                <Input onChange={handleAddressUpdate} value={address} />
                <YMap
                    query={{
                        ns: "use-load-option",
                        load: "Map,Placemark,control.ZoomControl,geocode,geoObject.addon.hint",
                    }}
                    setYmap={(ymaps) => { return setYmap(ymaps); }}
                    setLoading={setLoading}
                />
            </div>
            <Button variant={Variant.PRIMARY}>
                Сохранить
            </Button>
        </div>
    );
};
