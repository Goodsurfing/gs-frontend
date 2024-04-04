import React, { FC, useState } from "react";
import cn from "classnames";
import { Placemark } from "@pbe/react-yandex-maps";
import { YMap, YmapType } from "@/entities/Map";
import { validateCoordinates } from "@/features/MapWithAddress";
import defaultImage from "@/shared/assets/images/personalCardMOCK.png";
import styles from "./OffersMap.module.scss";
import { Portal } from "@/shared/ui/Portal/Portal";
import { OfferBalloon } from "../OfferBalloon/OfferBalloon";
import "./yandex-map-restyle-ballon.scss";

interface OffersMapProps {
    className?: string;
}

export const OffersMap: FC<OffersMapProps> = (props) => {
    const { className } = props;
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [ymap, setYmap] = useState<YmapType | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [activePortal, setActivePortal] = useState(false);

    const handlePlacemarkClick = (offer) => {
        setSelectedOffer(offer);
    };

    return (
        <div className={cn(className, styles.wrapper)}>
            <YMap
                mapState={{
                    center: [55.847973, 37.692542],
                    zoom: 10,
                }}
                className={cn(styles.map, {
                    [styles.loading]: !loading,
                })}
                setYmap={(ymaps) => setYmap(ymaps)}
                setLoading={setLoading}
                modules={["geoObject.addon.balloon"]}
            >
                <div className={styles.customPlacemark}>
                    <Placemark
                        geometry={[55.847973, 37.692542]}
                        properties={{ balloonContent: "<div id=\"balloon-offer\" class=\"offer-card\"></div>" }}
                        onClick={() => {
                            setTimeout(() => { setActivePortal(true); }, 0);
                        }}
                    />
                    {activePortal && (
                        <Portal className={styles.portal} elementId="balloon-offer">
                            <OfferBalloon title="Приют животных в петербурге" cover={defaultImage} />
                        </Portal>
                    )}
                </div>
            </YMap>
        </div>
    );
};
