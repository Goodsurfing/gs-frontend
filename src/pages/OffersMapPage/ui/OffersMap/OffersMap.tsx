import React, { FC, useState } from "react";
import cn from "classnames";
import { YMap, YmapType } from "@/entities/Map";
import { validateCoordinates } from "@/features/MapWithAddress";
import styles from "./OffersMap.module.scss";

interface OffersMapProps {
    className?: string;
}

export const OffersMap: FC<OffersMapProps> = (props) => {
    const { className } = props;
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [ymap, setYmap] = useState<YmapType | undefined>(undefined);
    const [loading, setLoading] = useState(false);

    const handlePlacemarkClick = (offer) => {
        setSelectedOffer(offer);
    };

    return (
        <div className={cn(className, styles.wrapper)}>
            <YMap
                mapState={{
                    center: [55, 55],
                    zoom: 10,
                }}
                className={cn(styles.map, {
                    [styles.loading]: !loading,
                })}
                setYmap={(ymaps) => setYmap(ymaps)}
                setLoading={setLoading}
            />
        </div>
    );
};
