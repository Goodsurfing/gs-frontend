import React, {
    FC, memo, useState,
} from "react";
import { Placemark } from "@pbe/react-yandex-maps";
import cn from "classnames";

import { useTranslation } from "react-i18next";
import { YMap, YmapType } from "@/entities/Map";

import { useLocale } from "@/app/providers/LocaleProvider";
import { OfferWhere } from "../../model/types/offerWhere";
import styles from "./OfferAddressCard.module.scss";
import { Text } from "@/shared/ui/Text/Text";

interface OfferAddressCardProps {
    address: OfferWhere;
    className?: string;
}

export const OfferAddressCard: FC<OfferAddressCardProps> = memo(
    (props: OfferAddressCardProps) => {
        const { address, className } = props;
        const { locale } = useLocale();
        const [, setYmap] = useState<YmapType | undefined>(undefined);
        const { t } = useTranslation("offer");

        return (
            <div className={cn(className, styles.wrapper)}>
                <Text title={t("personalOffer.Местоположение")} titleSize="h3" />
                <span>{address.address}</span>
                <YMap
                    mapState={{
                        center: [address.latitude, address.longitude],
                        zoom: 10,
                    }}
                    className={cn(styles.map)}
                    setYmap={(ymapsMap) => setYmap(ymapsMap)}
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
