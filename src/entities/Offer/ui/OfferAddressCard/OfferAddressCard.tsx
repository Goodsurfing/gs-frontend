import React, {
    FC, memo, useState,
} from "react";
import { Placemark } from "@pbe/react-yandex-maps";
import cn from "classnames";

import { YMap, YmapType } from "@/entities/Map";

import { useLocale } from "@/app/providers/LocaleProvider";
import { OfferWhere } from "../../model/types/offerWhere";
import styles from "./OfferAddressCard.module.scss";

interface OfferAddressCardProps {
    address: OfferWhere;
    className?: string;
}

export const OfferAddressCard: FC<OfferAddressCardProps> = memo(
    (props: OfferAddressCardProps) => {
        const { address, className } = props;
        const { locale } = useLocale();
        const [, setYmap] = useState<YmapType | undefined>(undefined);

        return (
            <div className={cn(className, styles.wrapper)}>
                <h3 className={styles.title}>Местоположение</h3>
                <span>{address.address}</span>
                <YMap
                    mapState={{
                        center: [address.latitude, address.longitude],
                        zoom: 10,
                    }}
                    className={cn(styles.map)}
                    setYmap={(ymaps) => setYmap(ymaps)}
                    locale={locale}
                >
                    <Placemark
                        geometry={[address.latitude, address.longitude]}
                    />
                </YMap>
            </div>
        );
    },
);
