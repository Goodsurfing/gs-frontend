import { Placemark } from "@pbe/react-yandex-maps";
import cn from "classnames";
import React, {
    FC, useEffect, useRef, useState,
} from "react";

import { validateCoordinates } from "@/features/MapWithAddress";

import { YMap, YmapType } from "@/entities/Map";

import defaultImage from "@/shared/assets/images/personalCardMOCK.png";
import useTimeout from "@/shared/hooks/useTimeout";
import { Portal } from "@/shared/ui/Portal/Portal";

import { OfferBalloon } from "../OfferBalloon/OfferBalloon";
import styles from "./OffersMap.module.scss";
import "./yandex-map-restyle-ballon.scss";

interface OffersMapProps {
    className?: string;
}

interface GeometryType {
    geometry: number[][];
}

export const OffersMap: FC<OffersMapProps> = (props) => {
    const { className } = props;
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [ymap, setYmap] = useState<YmapType | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [activePortal, setActivePortal] = useState(false);
    const testData = [
        { geometry: [55.788028, 49.121729] },
        { geometry: [55.78979, 49.117149] },
        { geometry: [55.788824, 49.114648] },
    ];

    const handlePlacemarkClick = (offer) => {
        setSelectedOffer(offer);
    };

    return (
        <div className={cn(className, styles.wrapper)}>
            <YMap
                mapState={{
                    center: [55.788273, 49.1194],
                    zoom: 15,
                }}
                className={cn(styles.map, {
                    [styles.loading]: !loading,
                })}
                setYmap={(ymaps) => setYmap(ymaps)}
                setLoading={setLoading}
                modules={["geoObject.addon.balloon"]}
            >
                <div className={styles.customPlacemark}>
                    {testData.map((test) => (
                        <Placemark
                            geometry={test.geometry}
                            properties={{
                                balloonContent:
                                    "<div id=\"balloon-offer\" class=\"offer-card\">ПРИВЕТ!!!</div>",
                            }}
                            options={{
                                hideIconOnBalloonOpen: false,
                                openEmptyBalloon: false,

                            }}
                            onClick={() => {
                                setTimeout(() => {
                                    setActivePortal(true);
                                }, 0);
                            }}
                        />
                    ))}
                    {/* {activePortal && (
                        <Portal
                            className={styles.portal}
                            elementId="balloon-offer"
                        >
                            <OfferBalloon
                                title="Приют животных в петербурге"
                                cover={defaultImage}
                            />
                        </Portal>
                    )} */}
                </div>
            </YMap>
        </div>
    );
};
