import cn from "classnames";
import React, { FC, useMemo } from "react";

import { useLocale } from "@/app/providers/LocaleProvider";

import { OfferPlacemark } from "../OfferPlacemark/OfferPlacemark";
import styles from "./OffersPlacemarkList.module.scss";

interface OffersPlacemarkListProps {
    data: any[];
    className?: string;
}

export const OffersPlacemarkList: FC<OffersPlacemarkListProps> = (props) => {
    const { data, className } = props;
    const { locale } = useLocale();

    const offersPlacemarkList = useMemo(
        () => data.map(({
            id, geometry, image, title,
        }) => (
            <OfferPlacemark
                id={id}
                geometry={geometry}
                image={image}
                title={title}
                locale={locale}
                key={id}
            />
        )),
        [data, locale],
    );

    return (
        <div className={cn(className, styles.wrapper)}>
            {offersPlacemarkList}
        </div>
    );
};
