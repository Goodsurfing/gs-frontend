import React, { FC, memo } from "react";

import { Placemark } from "@pbe/react-yandex-maps";
import styles from "./OfferPlacemark.module.scss";

interface OfferPlacemarkProps {
    id: string;
    geometry: number[];
    image: string;
    title: string;
    locale: string
}

export const OfferPlacemark: FC<OfferPlacemarkProps> = memo(
    (props: OfferPlacemarkProps) => {
        const {
            id,
            title,
            image,
            geometry,
            locale,
        } = props;
        return (
            <Placemark
                key={id}
                geometry={geometry}
                properties={{
                    balloonContent:
                `<div id="ballon-offer" class="offer-card">
                    <div class="${styles.ballonWrapper}">
                        <a href="/${locale}/offer-personal/${id}">
                        <img class="${styles.ballonImage}" src="${image}"/>
                        </a>
                        <a href="/${locale}/offer-personal/${id}">
                            <span class="${styles.ballonTitle}">${title}</span>
                        </a>
                    </div>
                </div>`,
                }}
                options={{
                    preset: "islands#blueDotIcon",
                    hideIconOnBalloonOpen: false,
                    openEmptyBalloon: false,
                }}
            />
        );
    },
);
