import React, {
    ChangeEvent, FC, useCallback, useEffect, useMemo, useState,
} from "react";

import cn from "classnames";

import { YMap, YmapType, GeoObject } from "@/entities/Map";

import useDebounce from "@/shared/hooks/useDebounce";

import { getGeoObjectCollection } from "../model/services/getGeoObjectCollection/getGeoObjectCollection";

import AutoComplete from "@/shared/ui/AutoComplete/AutoComplete";

import styles from "./MapWithAddress.module.scss";

interface MapWithAddressProps {
    className?: string;
}

export const MapWithAddress: FC<MapWithAddressProps> = ({ className }) => {
    const [ymap, setYmap] = useState<YmapType | undefined>(undefined);
    const [loaded, setLoaded] = useState(false);

    const [value, setValue] = useState<GeoObject | null>(null);
    const [options, setOptions] = useState<GeoObject[]>([]);
    const [inputValue, setInputValue] = useState("");

    const debouncedAddress = useDebounce(inputValue, 300);

    const data = useMemo(
        () => getGeoObjectCollection(debouncedAddress)
            .then((res) => res),
        [debouncedAddress],
    );

    const handleValueChange = useCallback((newValue: GeoObject | null) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
    }, [options]);

    useEffect(() => {
        let active = true;

        if (!ymap) {
            return undefined;
        }

        if (debouncedAddress === "") {
            setOptions(value ? [value] : []);
            return undefined;
        }

        if (active) {
            let newOptions: readonly GeoObject[] = [];
            if (value) {
                newOptions = [value];
            }
            if (results) {
                
                // newOptions = [...newOptions, ...data];
            }
        }

        return () => {
            active = false;
        };
    }, [value, ymap, debouncedAddress]);

    // useEffect(() => {
    //     if (address === "") {
    //         return undefined;
    //     }
    //     (async () => {
    //         if (debouncedAddress && ymap) {
    //             setHintsLoading(true);
    //             const data = await getGeoObjectCollection(debouncedAddress);
    //             if (data && data.featureMember.length) {
    //                 setHints(data.featureMember.map((item) => item.GeoObject.name));
    //                 setHintsLoading(false);
    //             } else {
    //                 setHintsLoading(false);
    //                 setHints([]);
    //             }
    //         }
    //     })();
    // }, [debouncedAddress, ymap]);

    return (
        <div className={cn(styles.wrapper, className)}>
            <div className={styles.content}>
                <AutoComplete
                    onChange={handleValueChange}
                    options={options}
                    noOptionsText="Точек на карте не найдено"
                    labelText="Введите адрес"
                />
                <YMap
                    className={styles.map}
                    query={{
                        ns: "use-load-option",
                        load: "Map,Placemark,control.ZoomControl,geocode,geoObject.addon.hint",
                    }}
                    setYmap={(ymaps) => setYmap(ymaps)}
                    setLoading={setLoaded}
                />
            </div>
        </div>
    );
};
