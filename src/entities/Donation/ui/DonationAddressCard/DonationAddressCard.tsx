import React, {
    FC, memo, useState,
} from "react";
import { Placemark } from "@pbe/react-yandex-maps";
import cn from "classnames";

import { useTranslation } from "react-i18next";
import { YMap, YmapType } from "@/entities/Map";

import { useLocale } from "@/app/providers/LocaleProvider";
import { Text } from "@/shared/ui/Text/Text";
import styles from "./DonationAddressCard.module.scss";

interface DonationAddressCardProps {
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    className?: string;
}

export const DonationAddressCard: FC<DonationAddressCardProps> = memo(
    (props: DonationAddressCardProps) => {
        const {
            address, latitude, longitude, className,
        } = props;
        const { locale } = useLocale();
        const [, setYmap] = useState<YmapType | undefined>(undefined);
        const { t } = useTranslation("donation");

        if (latitude === null || longitude === null) {
            return (
                <div className={cn(className, styles.wrapper)}>
                    <Text title={t("donationPersonal.Местоположение")} titleSize="h3" />
                    <span>{t("donationPersonal.Местоположение не было указано")}</span>
                </div>
            );
        }

        return (
            <div className={cn(className, styles.wrapper)} id="address">
                <Text title={t("donationPersonal.Местоположение")} titleSize="h3" />
                <span>{address}</span>
                <YMap
                    mapState={{
                        center: [latitude, longitude],
                        zoom: 10,
                    }}
                    className={cn(styles.map)}
                    setYmap={(ymapsMap) => setYmap(ymapsMap)}
                    locale={locale}
                >
                    <Placemark
                        geometry={[latitude, longitude]}
                    />
                </YMap>
            </div>
        );
    },
);
