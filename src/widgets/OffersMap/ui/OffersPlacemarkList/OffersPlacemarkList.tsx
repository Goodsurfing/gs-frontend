import cn from "classnames";
import React, { FC, useMemo } from "react";

import { useLocale } from "@/app/providers/LocaleProvider";

import { OfferPlacemark } from "../OfferPlacemark/OfferPlacemark";
import styles from "./OffersPlacemarkList.module.scss";
import { Offer } from "@/entities/Offer";
import { getMediaContent } from "@/shared/lib/getMediaContent";

interface OffersPlacemarkListProps {
    data: Offer[];
    className?: string;
}

export const OffersPlacemarkList: FC<OffersPlacemarkListProps> = (props) => {
    const { data, className } = props;
    const { locale } = useLocale();

    const offersPlacemarkList = useMemo(
        () => data.map(({
            id, where, description, status,
        }) => {
            if (status === "active" && where) {
                const geometry = [where.latitude, where.longitude];

                return (
                    <OfferPlacemark
                        id={id.toString()}
                        geometry={geometry}
                        image={getMediaContent(description?.image, "SMALL")}
                        title={description?.title ?? ""}
                        locale={locale}
                        category={description?.categoryIds[0]}
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
