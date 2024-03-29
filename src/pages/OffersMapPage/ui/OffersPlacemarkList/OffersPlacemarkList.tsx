import { Placemark } from "@pbe/react-yandex-maps";
import cn from "classnames";
import React, { FC, useMemo } from "react";

import { validateCoordinates } from "@/features/MapWithAddress";

import { Offer } from "@/entities/Offer";

import styles from "./OffersPlacemarkList.module.scss";

interface OffersPlacemarkListProps {
    data: Offer[];
    className?: string;
}

export const OffersPlacemarkList: FC<OffersPlacemarkListProps> = (props) => {
    const { data, className } = props;

    const offersPlacemarkList = useMemo(
        () => data.map(() => <Placemark geometry={validateCoordinates} />),
        [data],
    );

    return <div className={cn(className, styles.wrapper)}>{offersPlacemarkList}</div>;
};
