import { LocationType, ymapsDefaultLocation } from "@/constants/ymaps";
import React, { FC, useEffect, useState } from "react";
import { Placemark, YMaps } from "react-yandex-maps";

import Input from "@/components/ui/Input/Input";

import useDebounce from "@/hooks/useDebounce";

import getGeocodeByName from "@/utils/ymaps/getGeocodeByName";
import getYmapCoordinates from "@/utils/ymaps/getYmapCoordinates";
import validateCoordinates from "@/utils/ymaps/normalizeCoordinates";

import YandexMap from "../YMap";
import { YMapType } from "../types/ymaps";
import styles from "./YMapWithAddress.module.scss";

const YMapWithAddress: FC = () => {
    const [ymap, setYmap] = useState<YMapType>(null);
    const [address, setAddress] = useState<string>("");
    const [normalizedCoordinates, setNormalizedCoordinates] =
        useState<LocationType>();
    const debouncedValue = useDebounce(address, 1500);

    useEffect(() => {
        if (ymap) {
            validateCoordinates(ymap, address)
                .then((res) => getGeocodeByName(ymap, res))
                .then((res) => getYmapCoordinates(res))
                .then((res) => setNormalizedCoordinates(res));
        }
    }, [debouncedValue]);

    console.log(normalizedCoordinates);

    return (
        <>
            <Input
                label="Адрес"
                type="text"
                placeholder="Улица или координаты"
                onChange={(e) => setAddress(e.target.value)}
            />
            <YMaps query={{ apikey: "32dcfbe4-583a-4e13-be77-83d32a181111" }}>
                <YandexMap
                    className={styles.ymap}
                    ymap={ymap}
                    setYmap={setYmap}
                    zoom={12}
                    defaultLocation={ymapsDefaultLocation}
                    location={normalizedCoordinates}
                    modules={["geocode"]}
                >
                    {normalizedCoordinates && (
                        <Placemark
                            options={{
                                preset: "islands#circleIcon",
                                iconColor: "#0EC261",
                            }}
                            geometry={normalizedCoordinates}
                        />
                    )}
                </YandexMap>
            </YMaps>
        </>
    );
};

export default YMapWithAddress;
