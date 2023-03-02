import { LocationType, ymapsDefaultLocation } from "@/constants/ymaps";
import React, { FC, useEffect, useState } from "react";
import { Placemark } from "react-yandex-maps";

import Hints from "@/components/Hints/Hints";
import Input from "@/components/ui/Input/Input";

import useDebounce from "@/hooks/useDebounce";

import getGeocodeByName from "@/utils/ymaps/getGeocodeByName";
import { getHints } from "@/utils/ymaps/getHints";
import getYmapCoordinates from "@/utils/ymaps/getYmapCoordinates";
import validateCoordinates from "@/utils/ymaps/normalizeCoordinates";

import YandexMap from "../YMap";
import { GeoObjectHintType, YMapType } from "../types/ymaps";
import styles from "./YMapWithAddress.module.scss";

const YMapWithAddress: FC = () => {
    const [ymap, setYmap] = useState<YMapType>(null);
    const [address, setAddress] = useState<string>("");
    const [normalizedCoordinates, setNormalizedCoordinates] =
        useState<LocationType>();
    const [selectedAddresByHint, setSelectedAddressByHint] =
        useState<boolean>(false);
    const [routesList, setRoutes] = useState<Array<GeoObjectHintType>>([]);

    const debouncedAddress = useDebounce(address, 1000);

    useEffect(() => {
        if (ymap && address.length > 3) {
            validateCoordinates(ymap, debouncedAddress)
                .then((res) => getGeocodeByName(ymap, res))
                .then((res) => getYmapCoordinates(res))
                .then((res) => setNormalizedCoordinates(res));
        }
    }, [ymap, debouncedAddress]);

    useEffect(() => {
        getHints(address).then((hints) => setRoutes(hints));
    }, [address]);

    return (
        <>
            <Input
                label="Адрес"
                type="text"
                onFocus={() => setSelectedAddressByHint(false)}
                onChange={(e) => setAddress(e.target.value)}
                value={address}
            >
                {routesList?.length > 0 && (
                    <Hints
                        hints={routesList}
                        selectedAddressByHint={selectedAddresByHint}
                        setAddress={setAddress}
                        setAddressByHint={setSelectedAddressByHint}
                    />
                )}
            </Input>
            <YandexMap
                className={styles.ymap}
                ymap={ymap}
                setYmap={setYmap}
                zoom={12}
                defaultLocation={ymapsDefaultLocation}
                location={normalizedCoordinates}
                modules={["geocode", "geoObject.addon.hint"]}
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
        </>
    );
};

export default YMapWithAddress;
