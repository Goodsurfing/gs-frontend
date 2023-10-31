import { Placemark } from "@pbe/react-yandex-maps";
import cn from "classnames";
import React, {
    FC, memo, useState, useEffect,
} from "react";

import { validateCoordinates } from "@/features/MapWithAddress/model/lib/validateCoordinates";

import { GeoObject, GeoObjectCollection, YMap, YmapType } from "@/entities/Map";

import styles from "./OfferAddressCard.module.scss";
import { getGeoObjectCollection } from "@/features/MapWithAddress/model/services/getGeoObjectCollection/getGeoObjectCollection";

interface OfferAddressCardProps {
    address: string;
}

export const OfferAddressCard: FC<OfferAddressCardProps> = memo(
    (props: OfferAddressCardProps) => {
        const { address } = props;
        const [ymap, setYmap] = useState<YmapType | undefined>(undefined);
        const [coordinates, setCoordinates] = useState<GeoObject | null>();

        useEffect(() => {
            getGeoObjectCollection(address).then((response) => {
                setCoordinates(response?.featureMember[1].);
            });
        }, [address]);

        useEffect(() => {
            console.log(coordinates);
        }, [coordinates]);

        return (
            <div className={styles.wrapper}>
                <h3 className={styles.title}>Местоположение</h3>
                <span>{address}</span>
                <YMap
                    mapState={{
                        center: validateCoordinates(""),
                        zoom: 10,
                    }}
                    className={cn(styles.map)}
                    setYmap={(ymaps) => setYmap(ymaps)}
                >
                    <Placemark
                        geometry={validateCoordinates("")}
                    />
                </YMap>
            </div>
        );
    },
);
