import cn from "classnames";
import React, { FC, useMemo } from "react";

import { useLocale } from "@/app/providers/LocaleProvider";

import { OfferPlacemark } from "../OfferPlacemark/OfferPlacemark";
import { OfferApi } from "@/entities/Offer";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import styles from "./OffersPlacemarkList.module.scss";
import { textSlice } from "@/shared/lib/textSlice";

interface OffersPlacemarkListProps {
    data: OfferApi[];
    className?: string;
}

export const OffersPlacemarkList: FC<OffersPlacemarkListProps> = (props) => {
    const { data, className } = props;
    const { locale } = useLocale();

    const offersPlacemarkList = useMemo(
        () => data.map(({
            id, title, status, categories, latitude, longitude, image,
        }) => {
            if (status === "active" && typeof latitude === "number" && typeof longitude === "number") {
                return (
                    <OfferPlacemark
                        id={id.toString()}
                        geometry={[latitude, longitude]}
                        image={getMediaContent(image?.contentUrl, "SMALL")}
                        title={textSlice(title, 30, "title")}
                        locale={locale}
                        category={categories[0]}
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
