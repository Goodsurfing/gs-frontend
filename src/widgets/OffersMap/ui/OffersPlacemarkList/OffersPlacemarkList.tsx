import cn from "classnames";
import React, { FC, useMemo } from "react";

import { useLocale } from "@/app/providers/LocaleProvider";

import { OfferPlacemark } from "../OfferPlacemark/OfferPlacemark";
import { OfferMap } from "@/entities/Offer";
import styles from "./OffersPlacemarkList.module.scss";

interface OffersPlacemarkListProps {
    data: OfferMap[];
    className?: string;
}

export const OffersPlacemarkList: FC<OffersPlacemarkListProps> = (props) => {
    const { data, className } = props;
    const { locale } = useLocale();

    const offersPlacemarkList = useMemo(
        () => data.map(({
            id, name, categories, latitude, longitude,
        }) => {
            if (typeof latitude === "number" && typeof longitude === "number") {
                return (
                    <OfferPlacemark
                        id={id.toString()}
                        name={name}
                        geometry={[latitude, longitude]}
                        locale={locale}
                        categoryColor={categories[0]?.color}
                        key={id}
                    />
                );
            } return null;
        }),
        [data, locale],
    );

    return (
        <div className={cn(className, styles.wrapper)}>
            {offersPlacemarkList}
        </div>
    );
};
