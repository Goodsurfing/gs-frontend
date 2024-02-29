import React, {
    FC, memo, useEffect, useState,
} from "react";
import { Placemark } from "@pbe/react-yandex-maps";
import cn from "classnames";

import { validateCoordinates } from "@/features/MapWithAddress/model/lib/validateCoordinates";
import { getGeoObjectCollection } from "@/features/MapWithAddress/model/services/getGeoObjectCollection/getGeoObjectCollection";

import { GeoObject, YMap, YmapType } from "@/entities/Map";

import styles from "./OfferAddressCard.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";

interface OfferAddressCardProps {
    address: string;
    className?: string;
}

export const OfferAddressCard: FC<OfferAddressCardProps> = memo(
    (props: OfferAddressCardProps) => {
        const { address, className } = props;
        const { locale } = useLocale();
        const [, setYmap] = useState<YmapType | undefined>(undefined);
        const [coordinates, setCoordinates] = useState<GeoObject | null>();

        useEffect(() => {
            getGeoObjectCollection(address, locale).then((response) => {
                if (response?.featureMember.length) {
                    setCoordinates(response.featureMember[0].GeoObject);
                }
            });
        }, [address, locale]);

        return (
            <div className={cn(className, styles.wrapper)}>
                <h3 className={styles.title}>Местоположение</h3>
                <span>{address}</span>
                <YMap
                    mapState={{
                        center: validateCoordinates(coordinates?.Point.pos),
                        zoom: 10,
                    }}
                    className={cn(styles.map)}
                    setYmap={(ymaps) => setYmap(ymaps)}
                >
                    <Placemark
                        geometry={validateCoordinates(coordinates?.Point.pos)}
                    />
                </YMap>
            </div>
        );
    },
);
